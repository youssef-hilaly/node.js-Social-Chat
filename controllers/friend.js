const { validationResult } = require('express-validator')
const mongoose = require('mongoose');
const User = require('../models/user');
const Chatroom = require('../models/chatRoom');

exports.getRequests = async (req, res, next) => {
    const userId = req.userId;

    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            const error = new Error('current user not found');
            error.statusCode = 404;
            throw error;
        }
        if (user.friendRequests.length == 0) {
            return res.status(200).json({
                message: 'success',
                friendRequests: []
            });
        }
        const friendRequests = [];
        for (let i = 0; i < user.friendRequests.length; i++) {
            const friend = await User.findOne({ _id: user.friendRequests[i] }).select('_id name email');
            friendRequests.push(friend);
        }
        res.status(200).json({
            message: 'success',
            friendRequests: friendRequests
        });
    }
    catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.postRequest = async (req, res, next) => {
    const userId = req.userId; // who want to make a request
    const friendId = req.body.friendId; // wanted friend

    try {

        if (!friendId) {
            const error = new Error('Friend id is missing');
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOne({ _id: friendId });

        if (!user) {
            const error = new Error('Friend not found');
            error.statusCode = 404;
            throw error;
        }

        user.friendRequests.push(new mongoose.Types.ObjectId(userId));
        await user.save();
        // send reminder
        res.status(200).json({
            message: 'Friend request sent successfully'
        });
    }
    catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.postAccept = async (req, res, next) => {
    const userId = req.userId; // who make accept user1
    const friendId = req.body.friendId; // who make add request user2

    try {
        if (!friendId) {
            const error = new Error('Friend id is missing');
            error.statusCode = 400;
            throw error;
        }

        const user1 = await User.findOne({ _id: userId });
        const user2 = await User.findOne({ _id: friendId });

        if (!user1) {
            const error = new Error('current user not found');
            error.statusCode = 404;
            throw error;
        }

        if (!user2) {
            const error = new Error('Friend not found');
            error.statusCode = 404;
            throw error;
        }

        //user1.friendRequests have friendId
        const requestIdx = user1.friendRequests.findIndex(objId => objId.toString() == friendId);

        if (requestIdx == -1) {
            const error = new Error('Request not found');
            error.statusCode = 404;
            throw error;
        }

        user1.friends.push(new mongoose.Types.ObjectId(friendId));
        user1.friendRequests.splice(requestIdx, 1);

        user2.friends.push(new mongoose.Types.ObjectId(userId));

        await user1.save();
        await user2.save();

        const chat = new Chatroom({
            members: [new mongoose.Types.ObjectId(friendId), new mongoose.Types.ObjectId(userId)],
            messages: []
        });

        await chat.save();

        res.status(200).json({
            message: 'Friend request accepted!'
        });
    }
    catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}


exports.postReject = async (req, res, next) => {
    const userId = req.userId; // who make reject user1
    const friendId = req.body.friendId; // who make add request user2

    try {
        if (!friendId) {
            const error = new Error('Friend id is missing');
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOne({ _id: userId });


        if (!user) {
            const error = new Error('current user not found');
            error.statusCode = 404;
            throw error;
        }

        //user1.friendRequests have friendId
        const requestIdx = user.friendRequests.findIndex(objId => objId.toString() == friendId);

        if (requestIdx == -1) {
            const error = new Error('Request not found');
            error.statusCode = 404;
            throw error;
        }

        user.friendRequests.splice(requestIdx, 1);

        await user.save();

        res.status(200).json({
            message: 'Friend request rejected!'
        });
    }
    catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}