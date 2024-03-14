import net from "node:net";
const PORT = 8000;

// ROOMS will have key as chat room and it's value will be an array of clients in that room
const ROOMS = { universal: [] };
// Using ID to create room name randomly
let ID = 1;

// This will send message to all user in given room but not the sender
const broadcastMessage = (message, senderSocket, room) => {
  ROOMS[room].forEach((client) => {
    if (client !== senderSocket) {
      client.write(message);
    }
  });
};

// This will send all room that are available to client
const sendRooms = (senderSocket) =>
  senderSocket.write(JSON.stringify({ rooms: Object.keys(ROOMS) }));

// ************************************************************Creating Server*******************************************************
const server = net.createServer((socket) => {
  // Send all rooms to client when first connected
  sendRooms(socket);

  // To keep track of current room
  let currentRoomName;

  socket.on("data", (data) => {
    data = JSON.parse(data.toString());

    const msgObj = {
      remoteAddress: socket.remoteAddress,
      remotePort: socket.remotePort,
      room: data.room,
    };

    if (!data.isNewClient) {
      let room = data.room;
      if (data.join) {
        socket._write;
        // If user has requested to join the room
        if (room === "create new") {
          // While joining user has requested to create new room
          msgObj.room = "room" + ID++;
          ROOMS[msgObj.room] = [socket];
          msgObj.isNewlyCreatedRoom = true;
          msgObj.allRooms = Object.keys(ROOMS);
        } else {
          // If user is joining already existing rooms
          ROOMS[data.room] = [...(ROOMS[data.room] || []), socket];
        }
        msgObj.message = `You joined ${msgObj.room}!`;
        // When user have successfully joined current room the send message to current user only
        socket.write(JSON.stringify(msgObj));
      } else {
        // This block will run  in case of message only
        msgObj.message = data.message;
        broadcastMessage(JSON.stringify(msgObj), socket, msgObj.room);
      }
    }
    currentRoomName = msgObj.room;
  });

  socket.on("error", (err) => {
    console.log("ERROR: ", err);
  });

  socket.on("end", () => {
    //Remove current socket from respective ROOM
    if (currentRoomName) {
      const index = ROOMS[currentRoomName].indexOf(socket);
      if (index !== -1) ROOMS[currentRoomName].splice(index, 1);
    }
    console.log("Socket Ended!", currentRoomName);
  });
});

server.listen(PORT, () => {
  console.log("Chat app started!");
});
