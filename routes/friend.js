const express = require('express');
const { body } = require('express-validator');

const router = express.Router();


const isAuth = require('../middleware/is-auth');

const friendController = require('../controllers/friend');
//add friend, accept or reject friend
//friend requests

router.get('/requests', isAuth, friendController.getRequests);

router.post('/add', isAuth, friendController.postRequest);

router.post('/accept', isAuth, friendController.postAccept);

router.post('/reject', isAuth, friendController.postReject);

module.exports = router;