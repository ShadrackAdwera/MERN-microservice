const express = require('express');
const { body } = require('express-validator');
const { checkAuth } = require('@adwesh/common/src/index');

const { addTickets, getTickets, getUserTickets, findTicketById, updateTicket } = require('../controllers/ticket-controller');
const router = express.Router();

router.get('/', getTickets);
router.get('/:ticketId', findTicketById);
router.use(checkAuth);
router.get('/user/:userId', getUserTickets);
router.post('/new', [ body('title').trim().isLength({min: 3}), body('price').trim().not().isEmpty() ], addTickets);
router.patch('/:ticketId', [ body('title').trim().isLength({min: 3}) ], updateTicket);

module.exports = router;



