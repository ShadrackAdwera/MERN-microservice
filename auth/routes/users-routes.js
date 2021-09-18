const express = require('express');

const { getCurrentUser } = require('../controllers/users-controllers');

const router = express.Router()

router.get('/currentuser', getCurrentUser);

module.exports = router;