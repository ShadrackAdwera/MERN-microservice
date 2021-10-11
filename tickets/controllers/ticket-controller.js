const { validationResult } = require('express-validator');

const { HttpError } = require("@adwesh/common/src/index");
const Ticket = require("../models/Ticket");

const populateQuery = [{ path: "user", select: ["email", "_id"] }];

//CREATE
const addTickets = async (req, res, next) => {
 const error = validationResult(req);
 if(!error.isEmpty()) {
     return next(new HttpError('Invalid inputs', 422));
 }
  const { userId } = req.user;
  const { title, price } = req.body;
  let createdTicket;
  //let foundUser;

  //TO DO: check if user exists*

  try {
    createdTicket = new Ticket({ title, price, user: userId });
    await createdTicket.save();
  } catch (error) {
    return next(new HttpError("Unable to add ticket", 500));
  }
  res.status(201).json({ message: "Ticket added", ticket: createdTicket });
};

//READ
const getTickets = async (req, res, next) => {
  let tickets;
  try {
    tickets = await Ticket.find().populate(populateQuery).exec();
  } catch (error) {
    return next(new HttpError("Unable to fetch tickets", 500));
  }
  res
    .status(200)
    .json({
      tickets: tickets.map((ticket) => ticket.toObject({ getters: true })),
    });
};

const getUserTickets = async (req, res, next) => {
  const { userId } = req.params;
  let foundTickets;
  try {
    foundTickets = await Ticket.find({ user: userId })
      .populate(populateQuery)
      .exec();
  } catch (error) {
    return next(new HttpError("Unable to fetch tickets", 500));
  }
  res
    .status(200)
    .json({
      tickets: foundTickets.map((foundTicket) =>
        foundTicket.toObject({ getters: true })
      ),
    });
};

const findTicketById = async (req, res, next) => {
  const { ticketId } = req.params;
  let foundTicket;
  try {
    foundTicket = await Ticket.findById(ticketId).populate(populateQuery).exec();
  } catch (error) {
    return next(new HttpError("Unable to fetch ticket", 500));
  }
  if (!foundTicket) {
    return next(new HttpError("This ticket does not exist", 404));
  }
  res.status(200).json({ticket: foundTicket})
};

//UPDATE
const updateTicket = async (req, res, next) => {
  const { userId } = req.user;
  const { title } = req.body;
  const { ticketId } = req.params;
  let foundTicket;

  //TODO: Check if user exists*

  try {
    foundTicket = await Ticket.findById(ticketId).exec();
  } catch (error) {
    return next(new HttpError("Unable to fetch ticket", 500));
  }
  if (!foundTicket) {
    return next(new HttpError("This ticket does not exist", 404));
  }
  if (foundTicket._id.toString() !== userId.toString()) {
    return next(
      new HttpError("You are not authorized to perform this action", 403)
    );
  }
  foundTicket.title = title;
  try {
    await foundTicket.save();
  } catch (error) {
    return next(
      new HttpError("An error occured while updating the ticket", 500)
    );
  }
  res
    .status(200)
    .json({
      message: "Ticket information successfully updated",
      ticket: foundTicket.toObject({ getters: true }),
    });
};

exports.addTickets = addTickets;
exports.getTickets = getTickets;
exports.getUserTickets = getUserTickets;
exports.findTicketById = findTicketById;
exports.updateTicket = updateTicket;


