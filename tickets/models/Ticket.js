const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketSchema = new Schema({
    title: { type: String, required: true },
    price: {type: Number, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
}, { timestamps: true })

module.exports = mongoose.model('Ticket', ticketSchema);