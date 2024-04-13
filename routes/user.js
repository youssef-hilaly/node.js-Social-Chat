const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const User = require('../models/user');
const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

// friends, search


router.get('/friends', isAuth, userController.getFriends);

router.get('/search', isAuth, userController.getUsers);

module.exports = router;