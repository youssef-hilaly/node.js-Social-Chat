# node.js-SocialApp

## Table of Contents

* Project Overview: #project-overview
* Installation: #installation
* Usage: #usage
    * Environment Variables: #environment-variables
    * Starting the Application: #starting-the-application
* API Reference: #api-reference
    * Authentication (`/auth`): #authentication-auth
        * `POST /auth/login`: #post-auth-login
        * `POST /auth/signup`: #post-auth-signup
    * Friends (`/friend`): #friends-friend
        * `GET /friend/requests`: #get friend requests
        * `POST /friend/add`:
        #post-friend-request
        * `POST /friend/accept`: #post-friend-accept-friend-request
        * `POST /friend/reject`: #post-friend-reject-friend-request
    * Users (`/user`): #users-user
        * `GET /user/getFriends`: #get-user-getfriends
        * `GET /user/search`:
        #get-user-search
    * Chat (`/chat`): #chat-chat
        * `GET /chat/list`:
         #get-chat-list
        * `POST /chat/message: #post-chat-send-message
        * `GET /chat/messages`: #get-chat-messages
* Technologies: #technologies
* Database Schema: #database-schema
* Development: #development
    * Running Tests (Optional): #running-tests-optional
* License: #license

## Project Overview

This Node.js application provides a backend server for a social networking or chat application. It utilizes Express for routing, Mongoose for interacting with a MongoDB database, Socket.IO for real-time communication, and JWT (JSON Web Tokens) for authentication.

## Installation

1. Clone this repository.
2. Install dependencies:

   ```bash
   npm install
   ```

## Usage

### Environment Variables

Create a `.env` file in the project root directory and define the following environment variables:

* `MONGODB_URI`:  Your MongoDB connection URI.
* `JWT_SECRET`: A secret string used for signing and verifying JWTs.

### Starting the Application

1. Start the application development server:

   ```bash
   npm start
   ```

   This will start the server on port `3000` (default) by default. You can customize this port by setting the `PORT` environment variable.

2. Access the application in your browser at `http://localhost:3000` (or the custom port you specified).

## API Reference

All API endpoints require JWT authentication except for signup (`/auth/signup`).

### Authentication (`/auth`)

#### `POST /auth/login`

Request Body:

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

Response:

```json
{
  "token": "your_jwt_token"
}
```

**Description:** Authenticates a user and returns a JWT token upon successful login.

#### `POST /auth/signup`

Request Body:

```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "your_password"
}
```

Response:

```json
{
  "message": "User created successfully!"
}
```

**Description:** Creates a new user account.

### Friends (`/friend`)

#### `GET /friend/requests`

Request Headers:

* `Authorization`: Bearer <your_jwt_token>

Response:

```json
[
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "friend@example.com"
  },
  // ... (other friend requests)
]
```

**Description:** Retrieves a list of friend requests for the authenticated user.

#### `POST /friend/add`

Request Headers:

* `Authorization`: Bearer

Request Body:

```json
{
  "friendId": "friend_id"
}
```

Response:

```json
{
  "message": "Friend request sent successfully"
}
```

**Description:** Sends a friend request to another user.

#### `POST /friend/accept`

Request Headers:

* `Authorization`: Bearer <your_jwt_token>

Body:

```json
{
  "friendId": "friend_id"
}
```

Response:

```json
{
  "message": "Friend request accepted!"
}
```

**Description:** Accepts a friend request from another user.

#### `POST /friend/rejectd`

Request Headers:

* `Authorization`: Bearer <your_jwt_token>

Body:

```json
{
  "friendId": "friend_id"
}
```

Response:

```json
{
  "message": "Friend request rejected!"
}
```

**Description:** Rejects a friend request from another user.

### Users (`/user`)

#### `GET /user/friends`

Request Headers:

* `Authorization`: Bearer <your_jwt_token>

Response:

```json
[
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "friend@example.com"
  },
  // ... (other friends)
]
```

**Description:** Retrieves a list of the authenticated user's friends.

#### `GET /user/search`

Request Headers:

* `Authorization`: Bearer <your_jwt_token>

body:

```json
{
  "searchTerm": "search_term"
}
```

Response:

```json
[
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "user@example.com"
  },
  // ... (other users matching the search term)
]
```

**Description:** Searches for users based on the provided search term.

### Chat (`/chat`)

#### `GET /chat/list`

Request Headers:

* `Authorization`: Bearer <your_jwt_token>

Response:

```json

{
    "chatFriendList": [
        {
            "_id": "user_id_1",
            "name": "John Doe",
            "email": "example@example.com",
        },
        // ... (other chats)
    ]
},


```

**Description:** Retrieves a list of chat rooms that the authenticated user is a participant in.

#### `POST /chat/message`

Request Headers:

* `Authorization`: Bearer <your_jwt_token>

Request Body:

```json
{
    "friendId": "user_id",
    "message": "Your message content"
}
```

Response:

```json
{
  "message": "Message sent successfully!"
}
```

**Description:** Sends a message to a chat room.

#### `GET /chat/getMessages`

Request Headers:

* `Authorization`: Bearer <your_jwt_token>

Request Query Parameters:

* `friendId`: User ID of the friend

Response:

```json
{
    "messages": [
        {
            "from": "user_id",
            "to": "user_id",
            "text": "Your message content",
            "_id":  "message_id",
            "time": "message_time"
        },

    ]
}
```

## Technologies

This application utilizes the following technologies:

* Express.js (web framework)
* Mongoose (ODM for MongoDB)
* Socket.IO (real-time communication)
* bcrypt (password hashing)
* express-validator (data validation)
*jsonwebtoken (JWT)

## Database Schema

The application uses a MongoDB database with the following schemas:

* **User Schema:**
    * `name` (String, required)
    * `email` (String, required, unique)
    * `password` (String, required)
    * `friends` (Array of User IDs)
    * `friendRequests` (Array of User IDs)
* **ChatRoom Schema:**
    * `members` (Array of User IDs, required)
    * `messages` (Array of message objects)
        * `from` (User ID, required)
        * `to` (ChatRoom ID, required)
        * `text` (String, required)
        * `time` (Date, default: current time)

## Development

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and define the required environment variables.
4. Start the development server:

   ```bash
   npm start
   ```


