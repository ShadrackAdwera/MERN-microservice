const { validationResult } = require("express-validator");
const nats = require("node-nats-streaming");
const crypto = require("crypto");

const { HttpError } = require("@adwesh/common/src/index");
const Publisher = require("@adwesh/common/src/events/base-publisher");
const Ticket = require("../models/Ticket");
//const populateQuery = [{ path: "user", select: ["email", "_id"] }];

//CREATE
const addTickets = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid inputs", 422));
  }
  const { userId } = req.user;
  const { title, price } = req.body;
  let createdTicket;
  //let foundUser;

  //TO DO: check if user exists*

  try {
    createdTicket = new Ticket({ title, price, user: userId });
    await createdTicket.save();
    //publish event
    const stan = nats.connect("ticketing", crypto.randomUUID().toString(), {
      url: "http://nats-service:4222",
    });
    stan.on("connect", async () => {
      stan.on("close", () => {
        console.log("NATS connection closed");
        process.exit();
      });
      //interrupt signal
      process.on("SIGINT", () => stan.close());
      //terminate signal
      process.on("SIGTERM", () => stan.close());
      console.log("Connected to NATS");
      const publisher = new Publisher("ticket:created", stan);
      await publisher.publish({
        id: createdTicket._id.toString(),
        title: createdTicket.title,
        price: createdTicket.price,
        userId: createdTicket.user,
      });
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Unable to add ticket", 500));
  }
  res.status(201).json({ message: "Ticket added", ticket: createdTicket });
};

//READ
const getTickets = async (req, res, next) => {
  let tickets;
  try {
    tickets = await Ticket.find().exec();
  } catch (error) {
    console.log(error);
    return next(new HttpError("Unable to fetch tickets", 500));
  }
  res.status(200).json({
    tickets: tickets.map((ticket) => ticket.toObject({ getters: true })),
  });
};

const getUserTickets = async (req, res, next) => {
  const { userId } = req.params;
  let foundTickets;
  try {
    foundTickets = await Ticket.find({ user: userId }).exec();
  } catch (error) {
    return next(new HttpError("Unable to fetch tickets", 500));
  }
  res.status(200).json({
    tickets: foundTickets.map((foundTicket) =>
      foundTicket.toObject({ getters: true })
    ),
  });
};

const findTicketById = async (req, res, next) => {
  const { ticketId } = req.params;
  let foundTicket;
  try {
    foundTicket = await Ticket.findById(ticketId).exec();
  } catch (error) {
    return next(new HttpError("Unable to fetch ticket", 500));
  }
  if (!foundTicket) {
    return next(new HttpError("This ticket does not exist", 404));
  }
  res.status(200).json({ ticket: foundTicket.toObject({ getters: true }) });
};

//UPDATE
const updateTicket = async (req, res, next) => {
  const { userId } = req.user;
  const { title, price } = req.body;
  const { ticketId } = req.params;
  let foundTicket;

  //TODO: Check if user exists*

  try {
    foundTicket = await Ticket.findById(ticketId).exec();
  } catch (error) {
    return next(new HttpError("Unable to fetch ticket", 500));
  }
  if (!foundTicket) {
    return next(new HttpError("This ticket does not exist", 404));
  }
  if (foundTicket.user.toString() !== userId.toString()) {
    return next(
      new HttpError("You are not authorized to perform this action", 403)
    );
  }
  foundTicket.title = title;
  foundTicket.price = price;
  try {
    await foundTicket.save();
    //publish event
    const stan = nats.connect("ticketing", crypto.randomUUID().toString(), {
      url: "http://nats-service:4222",
    });
    stan.on("connect", async () => {
      stan.on("close", () => {
        console.log("NATS connection closed");
        process.exit();
      });
      //interrupt signal
      process.on("SIGINT", () => stan.close());
      //terminate signal
      process.on("SIGTERM", () => stan.close());
      console.log("Connected to NATS");
      const publisher = new Publisher("ticket:updated", stan);
      await publisher.publish({
        id: foundTicket._id.toString(),
        title: foundTicket.title,
        price: foundTicket.price,
        userId: foundTicket.user,
      });
    });
  } catch (error) {
    return next(
      new HttpError("An error occured while updating the ticket", 500)
    );
  }
  res.status(200).json({
    message: "Ticket information successfully updated",
    ticket: foundTicket.toObject({ getters: true }),
  });
};

exports.addTickets = addTickets;
exports.getTickets = getTickets;
exports.getUserTickets = getUserTickets;
exports.findTicketById = findTicketById;
exports.updateTicket = updateTicket;
