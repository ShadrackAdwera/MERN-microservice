const express = require('express');
const { body } = require('express-validator');

const { getCurrentUser, signUp, signIn, signOut } = require('../controllers/users-controllers');

const router = express.Router()

router.get('/:userId', getCurrentUser);
router.post('/login', [ body('email').normalizeEmail().isEmail(), body('password').trim().isLength({min: 6}) ] ,signIn);
router.post('/sign-up', [ body('email').normalizeEmail().isEmail(), body('password').trim().isLength({min: 6}) ], signUp);
router.post('/sign-out', signOut);

module.exports = router;