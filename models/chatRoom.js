const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatRoomSchema = new Schema({
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    messages: [{
        from: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        to: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        time: {
            type: Date, default: Date.now
        }
    }]
});

module.exports = mongoose.model('Chatroom', chatRoomSchema);

// Get all the conversations of a logged-in user with the user id of 1.
// db.chat_rooms.find({ members: 1 })

// Get all the documents, messages sent by the user id of 1.
// db.chat_rooms.find({ messages: { from: 1 } })


// {
//     "chat_rooms":[
//        {
//           "cid":100,
//           "members":[1, 2],
//           "messages":[
//             {"from":1, "to":2, "text":"Hey Dude! Bring it"},
//             {"from":2, "to":1, "text":"Sure man"}
//            ]
//        },
//        {
//           "cid":101,
//           "members":[3, 4],
//           "messages":[
//             {"from":3, "to":4, "text":"I can do that work"},
//             {"from":4, "to":3, "text":"Then we can proceed"}
//            ]
//        }
//     ]
//  }