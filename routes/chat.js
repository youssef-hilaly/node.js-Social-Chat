const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const User = require('../models/user');
const chatController = require('../controllers/chat');
const isAuth = require('../middleware/is-auth');


// list of chats with friends
router.get('/list', isAuth, chatController.getList);

// send a message
router.post('/message', isAuth, chatController.postMessage);

// messages of a friend,
router.get('/messages', isAuth, chatController.getMessages);



module.exports = router;