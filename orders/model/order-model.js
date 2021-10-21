const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    userId: { type: String, required: true },
    status: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    ticketId: { type: mongoose.Types.ObjectId, required: true, ref: 'Ticket' }
});

module.exports = mongoose.model('Order', orderSchema);