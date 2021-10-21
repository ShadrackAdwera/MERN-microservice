const mongoose = require('mongoose');
const { Schema } = mongoose;
const Order = require('./order-model');

const ticketSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    version: { type: Number, required: true }
});

ticketSchema.methods.isReserved = async function() {
    const foundOrder = await Order.findOne({
        ticket: this,
        status: { $in: ["created", "awaiting:payment", "complete"] },
      });
      return !!foundOrder
}

module.exports = mongoose.model('Ticket', ticketSchema);