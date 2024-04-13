let io;

exports.init = (httpServer) => {
    io = require('socket.io')(httpServer);
    return io;
}

exports.getIO = () => {
    if(!io){
        throw new Error('Socket.io not initialized!');
    }
    return io;
}

// save user id and socket id
const users = new Map();
exports.saveUserSocket = (userId, socketId) => {
    // if(users.has(userId)){
    //     users.set(userId, [...users.get(userId), socketId]);
    // }else
    // {
        users.set(userId, [socketId]);
    // }
}

// get socket id by user id
exports.getSocketByUserId = (userId) => {
    return users.get(userId);
}

// delete user id and socket id
exports.deleteUserSocket = (userId) => {
    users.delete(userId);
}

exports.getAllUsers = () => {
    return users;
}

