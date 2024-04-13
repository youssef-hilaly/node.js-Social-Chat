const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const User = require('../models/user');
const authController = require('../controllers/auth');

router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Invalid Email')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(user => {
                    if (user) {
                        return Promise.reject('Email Address is already exist');
                    }
                });
        })
        .normalizeEmail(),

    body('password')
        .trim()
        .isLength({ min: 5 }),

    body('name')
        .trim()
        .not()
        .isEmpty()
], authController.signup);

router.post('/login', authController.login);

module.exports = router;