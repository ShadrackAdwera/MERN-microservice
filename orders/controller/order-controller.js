const { validationResult } = require("express-validator");
const nats = require("node-nats-streaming");
const HttpError = require("@adwesh/common/src/error/httpError");
const Publisher = require("@adwesh/common/src/events/base-publisher");

const Order = require("../model/order-model");
const Ticket = require("../model/ticket-model");

const EXPIRATION_SECONDS = 15*60;
const populateQuery = [{ path: "ticket", select: ["_id","title", "price"] }];

/*Order Statuses
created - order has been created but the ticket has not been reserved.

cancelled - ticket from which the order was created has already been reserved by another order, 
or order expires before payment,
or order has been cancelled.

awaiting:payment - order successfully reserved the ticket.

complete - order has reserved the ticket and user has paid the amount successfully.
*/

const createOrder = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid inputs", 422));
  }
  let foundTicket;
  let foundOrder;
  const { userId } = req.user;
  //TODO: check if user exists
  const { ticketId } = req.body;
  //check if ticket exists
  try {
    foundTicket = await Ticket.findById(ticketId).exec();
  } catch (error) {
    return next(new HttpError("An error occured, try again", 500));
  }
  if (!foundTicket) {
    return next(new HttpError("This ticket does not exist", 404));
  }

  //check if ticket is not reserved
  try {
    foundOrder = await foundTicket.isReserved()
  } catch (error) {
      return next(new HttpError('Unable to fetch orders', 500));
  }
  if(foundOrder) {
      return next(new HttpError('This ticket has already been reserved', 422))
  }

  //calculate expiration seconds
//   Date.prototype.addSeconds = function (s) {
//     this.setSeconds(this.getSeconds() + s);
//     return this;
//   };
const expiration = new Date();

  const createdOrder = new Order({
    userId,
    status: "pending",
    expiresAt: expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECONDS),
    ticket: ticketId,
  });

  try {
    await createdOrder.save();
    //TODO: Publish an event for an order being created
    const stan = nats.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, {
    url: process.env.NATS_URL
    })
    stan.on("connect", async () => {
      stan.on("close", () => {
        console.log("NATS connection closed");
        process.exit();
      });
      //interrupt signal
      process.on("SIGINT", () => stan.close());
      //terminate signal
      process.on("SIGTERM", () => stan.close());
      console.log("Connected to NATS Orders");
      const publisher = new Publisher("order:created", stan);
      await publisher.publish({
        id: createdOrder._id.toString(),
        userId: createdOrder.userId,
        status: createdOrder.status,
        expiresAt: createdOrder.expiresAt,
        ticket: {
          id: foundTicket._id.toString(),
          title: foundTicket.title,
          price: foundTicket.price
        },
      });
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Unable to save order", 500));
  }


  res
    .status(201)
    .json({ message: "Your order was reserved!", order: createdOrder });
};

//get orders
// const getOrders = async(req,res,next) => {
//     let foundOrders;
//     try {
//         foundOrders = await Order.find().exec();
//     } catch (error) {
//         return next(new HttpError('Failed to fetch orders', 500));
//     }
//     res.status(200).json({orders: foundOrders.map(ord=>ord.toObject({getters: true}))})
// }

const getOrderById = async (req, res, next) => {
  let foundOrder;
  const { id } = req.params;
  const { userId } = req.user;
  try {
    foundOrder = await Order.findById(id).populate(populateQuery);
  } catch (error) {
    return next(new HttpError("Internal server error", 500));
  }
  if (!foundOrder) {
    return next(new HttpError("This order does not exists", 404));
  }
  if(foundOrder.userId !== userId) {
    return next(new HttpError('You are not authorized to view this ticket', 403));
  }
  res.status(200).json({ order: foundOrder.toObject({ getters: true }) });
};

const getUserOrders = async (req, res, next) => {
  const { userId } = req.user;
  let foundOrders;

  try {
    foundOrders = await Order.find({ userId }).populate(populateQuery).exec();
  } catch (error) {
    return next(new HttpError("Failed to fetch orders", 500));
  }
  res
    .status(200)
    .json({
      orders: foundOrders.map((ord) => ord.toObject({ getters: true })),
    });
};
const deleteOrders = async (req, res, next) => {
  const { id } = req.params;
  let foundOrder;

  try {
    foundOrder = await Order.findById(id).populate(populateQuery).exec();
  } catch (error) {
    return next(new HttpError("Unable to fetch order", 500));
  }
  if (!foundOrder) {
    return next(new HttpError("This order does not exist", 404));
  }

  try {
    //emit a event
    const stan = nats.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, {
      url: process.env.NATS_URL
      })
      stan.on("connect", async () => {
        stan.on("close", () => {
          console.log("NATS connection closed");
          process.exit();
        });
        //interrupt signal
        process.on("SIGINT", () => stan.close());
        //terminate signal
        process.on("SIGTERM", () => stan.close());
        console.log("Connected to NATS Cancel Orders");
        const publisher = new Publisher("order:cancelled", stan);
        await publisher.publish({
          id: foundOrder._id.toString(),
          ticket: {
            id: foundOrder.ticket._id.toString(),
            title: foundOrder.ticket.title,
            price: foundOrder.ticket.price
          },
        });
      });
    await Order.findByIdAndDelete(id).exec();
  } catch (error) {
    return next(
      new HttpError("An error occured while deleting the order, try again", 500)
    );
  }
  res.status(200).json({ message: "This order was deleted successfully" });
};

//exports.getOrders = getOrders;
exports.getOrderById = getOrderById;
exports.getUserOrders = getUserOrders;
exports.createOrder = createOrder;
exports.deleteOrders = deleteOrders;
