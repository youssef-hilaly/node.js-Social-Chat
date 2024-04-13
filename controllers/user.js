const { validationResult } = require('express-validator')

const User = require('../models/user')

exports.getFriends = async (req, res, next) => {
    const userId = req.userId;

    const user = await User.findOne({ _id: userId });

    const friendsIds = user.friends;

    const friends = await User.find({ _id: { $in: friendsIds } }).select('_id name email');

    res.status(200).json({
        friends: friends
    });
}

exports.getUsers = async (req, res, next) => {
    const searchTerm = req.body.searchTerm;

    if (!friendId) {
        const error = new Error('User Name is missing');
        error.statusCode = 400;
        throw error;
    }

    const users = await users.find({ name: { $regex: '.*' + searchTerm + '.*' } }).limit(10);

    res.status(200).json({
        users: users
    });
}