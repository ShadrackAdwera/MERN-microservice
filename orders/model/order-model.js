const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    userId: { type: String, required: true },
    status: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    ticketId: { type: String, required: true }
});

module.exports = mongoose.model('Order', orderSchema);