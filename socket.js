let io;

exports.init = (httpServer) => {
    io = require('socket.io')(httpServer);
    return io;
}

exports.getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
}

// save user id and socket id
const users = new Map();
exports.saveUserSocket = async (userId, socketId) => {
    if (users.has(userId)) {
        const socketId = users.get(userId);

        const oldSocket = io.sockets.sockets.get(socketId);
        if (oldSocket) {
            await oldSocket.disconnect(true);
        }
    }
    users.set(userId, socketId);

    //// number of connected users
    //console.log(io.engine.clientsCount);

    //// get all connected socket ids
    //let keys =[ ...io.sockets.sockets.keys() ];
    //console.log('users', keys);
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

