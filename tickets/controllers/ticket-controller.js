const { HttpError } = require('@adwesh/common/src/index');
const Ticket = require('../models/Ticket');

const populateQuery = [
    { path: 'user', select: ['email','_id'] }
]

//CREATE
const addTickets = async(req,res,next) => {
    const { userId } = req.user;
    const { title, price } = req.body
    let createdTicket;
    let foundUser;

    //check if user exists*

    try {
        createdTicket = new Ticket({title, price, user: userId});
    } catch (error) {
        return next(new HttpError('Unable to add ticket', 500));
    }
    res.status(201).json({message: 'Ticket added', ticket: createdTicket});
}

//READ
const getTickets = async(req,res,next) => {
    let tickets;
    try {
        tickets = await Ticket.find().populate(populateQuery).exec();
    } catch (error) {
        return next(new HttpError('Unable to fetch tickets', 500));
    }
    res.status(200).json({tickets: tickets.map(ticket=>ticket.toObject({getters: true}))})
}

const getUserTickets = async(req,res,next) => {
    const { userId } = req.params;
    let foundTickets
    try {
        foundTickets = await Ticket.find({user: userId}).populate(populateQuery).exec();
    } catch (error) {
        return next(new HttpError('Unable to fetch tickets', 500));
    }
    res.status(200).json({tickets: foundTickets.map(foundTicket=>foundTicket.toObject({getters: true}))})
}