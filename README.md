# Simple Chat Interface

A simple chat application made using Node.js typically involves creating a server that facilitates real-time communication between multiple clients using text based interface.

## How to use chat app

1. When the user starts the client, a prompt will ask for the IP address and port number.
2. After connecting to the server, a selection option will appear with all available chat rooms as options.
3. UP and Down arrow keys can be used for navigation, and the Enter key for selecting a chat room.
4. Once a chat room is selected, the user can send messages to that chat room by typing the message and pressing Enter. Messages will appear to all other users in the same chat room.

## Technologies Used

- NodeJS v20.x

## Description

**T**he architecture of a chat application using Node.js typically involves clients connecting to a central server, which manages communication between clients using the Net module.

NodeJS is single-threaded, but it is built on top of the libuv library, which provides an event loop that allows for asynchronous I/O operations.

Concurrency in Node.js is achieved through event-driven programming and non-blocking I/O. The Net module handles multiple connections concurrently using event listeners and callbacks. When a client connects to the server, a new event is triggered, and the server can handle multiple such events concurrently without blocking other operations.

## Start application locally

1. Clone the repository:

   ```bash
   git clone https://github.com/amresh-kumar-singh/simple-chat-interface.git
   ```

2. Navigate to project directroy:

   ```bash
   cd simple-chat-interface
   ```

### Server

1. Navigate to server directroy:

   ```bash
   cd server
   ```

2. Start server(Server is running on port: 8000):

   ```bash
   npm run server:dev
   ```

### Client

1. Navigate to client directory:

   ```bash
   cd client
   ```

2. Start client:

   ```bash
   npm run client:dev
   ```

3. Type **localhost:8000** and press enter to connect to server.
4. Select or create room. Use up and down arrow to navigate and press enter to select room.
5. After selecting the room start typing your message and press enter to send.

## Deployment

### Server Deployment with AWS EC2

- Launch an EC2 instance from AWS console.

- Connect and remote into EC2 instance via SSH.

- Once connected Install Node, NPM, PM2.

- Allow access to your EC2 instance via the port where you want your app server running.

- Now server can be accessed on by client on **ec2_instance_public_ip:port**

### How to access deployed server using client

- First, go to the client directory.
- Then run client using **node index.js** command.
- A prompt will appear asking you to enter the IP address followed by the port number. eg.(**ip_address:port_no**)
- After entering the address, all available rooms for chat will be shown, and the user can navigate using the up and down arrow keys.
- Users can join preexisting rooms or create new ones by hitting enter.
- Once a room is joined, users can type a message and hit enter to send.

## Licence

This project is licensed under the MIT.
