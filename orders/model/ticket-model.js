const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    version: { type: Number, required: true }
});

module.exports = mongoose.model('Ticket', ticketSchema);