const { validationResult } = require("express-validator");
const nats = require('node-nats-streaming');
const HttpError = require('@adwesh/common/src/error/httpError');
const Publisher = require("@adwesh/common/src/events/base-publisher");

const Order = require('../model/order-model');

const createOrder = async(req,res,next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }
    const { userId } = req.user;
    //check if user exists
    const { ticketId } = req.body;
    //check if ticket exists
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
        foundOrder = await Order.findById(id);
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
        foundOrders = await Order.find({userId}).exec();
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