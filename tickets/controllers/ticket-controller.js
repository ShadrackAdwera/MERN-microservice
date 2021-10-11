const { HttpError } = require('@adwesh/common/src/index');
const Ticket = require('../models/Ticket');

const getTickets = async(req,res,next) => {
    let tickets;
    try {
        tickets = await Ticket.find().exec();
    } catch (error) {
        return next(new HttpError('Unable to fetch tickets', 500));
    }
    res.status(200).json({tickets: tickets.map(ticket=>ticket.toObject({getters: true}))})
}

