import net from "node:net";
const PORT = 8000;

// ROOMS will have key as chat room and it's value will an array of clients in that room
const ROOMS = { universal: [] };
let ID = 1;

const broadcastMessage = (message, senderSocket, room) => {
  console.log("broadcase", room, Object.keys(ROOMS));
  ROOMS[room].forEach((client) => {
    if (client !== senderSocket) {
      client.write(message);
    }
  });
};

const sendRooms = (senderSocket) =>
  senderSocket.write(JSON.stringify({ rooms: Object.keys(ROOMS) }));

const server = net.createServer((socket) => {
  let firstDataCame = false;
  // Send all rooms to client when first connected
  sendRooms(socket);
  socket.on("data", (data) => {
    data = JSON.parse(data.toString());
    const msgObj = {
      remoteAddress: socket.remoteAddress,
      remotePort: socket.remotePort,
      room: data.room,
    };
    console.log("socket on ", data);
    if (!data.isNewClient) {
      //
      let room = data.room;
      if (data.join) {
        if (room === "create new") {
          msgObj.room = "room" + ID++;
          ROOMS[msgObj.room] = [socket];
          // msgObj.room = room;
          msgObj.isNewlyCreatedRoom = true;
          console.log(room, Object.keys(ROOMS));
          msgObj.allRooms = Object.keys(ROOMS);
        } else {
          ROOMS[data.room] = [...(ROOMS[data.room] || []), socket];
        }
        msgObj.message = "New User Joined!";
        console.log(msgObj);
        socket.write(JSON.stringify(msgObj));
      } else {
        msgObj.message = data.message;
        broadcastMessage(JSON.stringify(msgObj), socket, msgObj.room);
      }
      console.log(msgObj);
    }
    // if (!firstDataCame) {
    //   firstDataCame = true;
    // } else {
    //   console.log("data", data);
    //   //   data = data.toString();
    //   const parsedData = JSON.parse(data);
    //   let room = parsedData.room;
    //   const msgObj = {
    //     remoteAddress: socket.remoteAddress,
    //     remotePort: socket.remotePort,
    //     room,
    //   };
    //   console.log("parsed Data", parsedData);
    //   if (parsedData.join) {
    //     if (room === "create new") {
    //       room = "room" + ID++;
    //       ROOMS[room] = [socket];
    //       msgObj.room = room;
    //       msgObj.isNewlyCreatedRoom = true;
    //       console.log(room, Object.keys(ROOMS));
    //       msgObj.allRooms = Object.keys(ROOMS);
    //     } else {
    //       ROOMS[parsedData.room] = [...(ROOMS[parsedData.room] || []), socket];
    //     }
    //     msgObj.message = "New User Joined!";
    //     console.log(msgObj);
    //     socket.write(JSON.stringify(msgObj));
    //   } else {
    //     msgObj.message = parsedData.message;
    //     broadcastMessage(JSON.stringify(msgObj), socket, msgObj.room);
    //   }
    // }
  });

  socket.on("error", (err) => {
    console.log("ERROR: ", err);
  });

  socket.on("end", () => {
    //Remove current socket from ROOM
    console.log("Socket Ended!");
  });
});

server.listen(PORT, () => {
  console.log("Chat app started!");
});
