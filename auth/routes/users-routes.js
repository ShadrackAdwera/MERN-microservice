const express = require('express');
const { check } = require('express-validator');

const { getCurrentUser, signUp, signIn } = require('../controllers/users-controllers');

const router = express.Router()

router.get('/currentuser', getCurrentUser);
router.post('/login', [ check('email').normalizeEmail().isEmail(), check('password').isLength({min: 6}) ] ,signIn);
router.post('/sign-up', [ check('email').normalizeEmail().isEmail(), check('password').isLength({min: 6}) ], signUp);

module.exports = router;