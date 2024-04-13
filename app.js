const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRouter = require('./routes/auth');
const friendRouter = require('./routes/friend');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');

const app = express();

// parser
app.use(bodyParser.json());

// Access-Control
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

// app routes
app.use('/auth', authRouter);
app.use('/friend', friendRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);

// Error Handling
app.use((error, req, res, next) => {
    console.log(error);
    const statusCode = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(statusCode).json({ message: message, data: data });
})

// database connection and listen
const dbURL = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_Password}@cluster0.bp7n4vz.mongodb.net/messenger`;
mongoose.connect(dbURL)
.then(() => {
    const server = app.listen(8080);
    const socketController = require('./socket');
    socketController.init(server);
    const io = socketController.getIO();
    io.on('connection', socket => {
        // save user id and socket id
        socketController.saveUserSocket(socket.handshake.query.userId, socket.id);

        socket.on('disconnect', () => {
            console.log('client Disconnect');
            // delete user id and socket id
            socketController.deleteUserSocket(socket.handshake.query.userId);
        })
    });

})
.catch((err) => {
    console.log(err);
})