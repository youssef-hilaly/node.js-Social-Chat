const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.signup = async (req, res, next) => {

    const errors = validationResult(req).errors;
    const { name, email, password } = req.body;

    try {
        if (errors.length > 0) {
            const error = new Error('invalid Data');
            error.statusCode = 422;
            error.data = errors;
            throw error;
        }

        const hashedPw = await bcrypt.hash(password, 12);

        const user = new User({
            name: name,
            email: email,
            password: hashedPw,
            friends: []
        });

        await user.save();

        res.status(201).json({
            message: 'User created successfully!',
        })
    }
    catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error('Wrong email or password');
            error.statusCode = 401;
            throw error;
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Wrong email or password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({
            email: user.email,
            userId: user._id.toString(),
            userName: user.name,
        },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token: token, userId: user._id.toString() });
    }
    catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}