const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    userId: { type: String, required: true },
    status: { type: String, required: true },
    expiresAt: { type: Schema.Types.Date },
    ticket: { type: Schema.Types.ObjectId, required: true, ref: 'Ticket' }
});

module.exports = mongoose.model('Order', orderSchema);