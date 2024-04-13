const { validationResult } = require('express-validator')
const mongoose = require('mongoose');
const User = require('../models/user');
const Chatroom = require('../models/chatRoom');
const socketController = require('../socket');
const io = socketController;

exports.postMessage = async (req, res, next) => {
    const userId = req.userId;
    const friendId = req.body.friendId;
    const message = req.body.message;

    try {

        if (!friendId) {
            const error = new Error('Friend id is missing');
            error.statusCode = 400;
            throw error;
        }

        if (!message) {
            const error = new Error('message is missing');
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOne({ _id: userId });

        const isFriends = (user.friends.findIndex(objId => objId.toString() == friendId) != -1);

        if (!isFriends) {
            const error = new Error('Unauthorized action');
            error.statusCode = 401;
            throw error;
        }

        const chatRoom = await Chatroom.findOne({ members: { $all: [friendId, userId] } })


        chatRoom.messages.push({
            from: new mongoose.Types.ObjectId(userId),
            to: new mongoose.Types.ObjectId(friendId),
            text: message
        });

        await chatRoom.save();

        const friendSocketId = io.getSocketByUserId(friendId);

        if (friendSocketId) {
            let message = chatRoom.messages[chatRoom.messages.length - 1];
            const messageToEmit = {
                ...message._doc,
                action: 'newMessage'
            }
            io.getIO().to(friendSocketId).emit('message', messageToEmit);
        }

        res.status(200).json({
            message: 'Message sent successfully!'
        });
    }
    catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}


exports.getMessages = async (req, res, next) => {
    const userId = req.userId;
    const friendId = req.query.friendId;

    try {
        if (!friendId) {
            const error = new Error('Friend id is missing');
            error.statusCode = 400;
            throw error;
        }

        const chatRoom = await Chatroom.findOne({ members: { $all: [friendId, userId] } });

        res.status(200).json({
            message: 'success',
            messages: chatRoom.messages
        });
    }
    catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.getList = async (req, res, next) => {
    const userId = req.userId;

    try {
        const chatList = await Chatroom.find({ members: userId }).select('members');

        const chatFriendList = []

        for (let i = 0; i < chatList.length; i++) {
            const friendId = chatList[i].members.find(id => id.toString() != userId);
            const friend = await User.findOne({ _id: friendId }).select('name email');
            chatFriendList.push(friend);
        }

        res.status(200).json({
            chatFriendList: chatFriendList
        });
    }
    catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}