const { validationResult } = require("express-validator");
const nats = require('node-nats-streaming');
const HttpError = require('@adwesh/common/src/error/httpError');
const Publisher = require("@adwesh/common/src/events/base-publisher");

const Order = require('../model/order-model');
const Ticket = require('../model/ticket-model');

Date.prototype.addHours = function(h){
    this.setHours(this.getHours()+h);
    return this;
}

const populateQuery = [{ path: "ticket", select: ["title", "price"] }];

const createOrder = async(req,res,next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }
    let foundTicket;
    const { userId } = req.user;
    //check if user exists
    const { ticketId } = req.body;
    //check if ticket exists
    try {
        foundTicket = await Ticket.findById(ticketId).populate().exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    if(!foundTicket) {
        return next(new HttpError('This ticket does not exist', 404));
    }

    const createdOrder = new Order({
        userId, status: 'pending', expiresAt: new Date().addHours(1), ticket: ticketId
    })

    try {
        await createdOrder.save();
    } catch (error) {
        return next(new HttpError('Unable to save order', 500));
    }
    res.status(201).json({message: 'Your order was reserved!', order: createdOrder})
}

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

const getOrderById = async(req,res,next) => {
    let foundOrder;
    const { id } = req.params;
    try {
        foundOrder = await Order.findById(id).populate(populateQuery);
    } catch (error) {
        return next(new HttpError('Internal server error',500));
    }
    if(!foundOrder) {
        return next(new HttpError('This order does not exists', 404));
    }
    res.status(200).json({order: foundOrder.toObject({getters: true})});
}

const getUserOrders = async(req,res,next) => {
    const { userId } = req.user;
    let foundOrders;

    try {
        foundOrders = await Order.find({userId}).populate(populateQuery).exec();
    } catch (error) {
        return next(new HttpError('Failed to fetch orders', 500));
    }
    res.status(200).json({orders: foundOrders.map(ord=>ord.toObject({getters: true}))})

}
const deleteOrders = async(req,res,next) => {
    const { id } = req.params
    let foundOrder;

    try {
        foundOrder = await Order.findById(id).exec();
    } catch (error) {
        return next(new HttpError('Unable to fetch order',500));
    }
    if(!foundOrder) {
        return next(new HttpError('This order does not exist', 404));
    }

    try {
        await Order.findByIdAndDelete(id).exec();
    } catch (error) {
        return next(new HttpError('An error occured while deleting the order, try again', 500));
    }
    res.status(200).json({message: 'This order was deleted successfully'})
}

//exports.getOrders = getOrders;
exports.getOrderById = getOrderById;
exports.getUserOrders = getUserOrders;
exports.createOrder = createOrder;
exports.deleteOrders = deleteOrders;