const express = require('express');
const mongoose = require('mongoose');
const { body } = require('express-validator');
const checkAuth = require('@adwesh/common/src/middlewares/checkAuth');

const { createOrder, getOrderById, getUserOrders, deleteOrders } = require('../controller/order-controller');

const router = express.Router();

router.use(checkAuth);
router.get('/',getUserOrders);
router.get('/:id', getOrderById);
router.post('/', [
    body('ticketId')
    .not()
    .isEmpty()
    .custom((input)=> mongoose.Types.ObjectId.isValid(input))
], createOrder);
router.delete('/:id', deleteOrders);

module.exports = router;