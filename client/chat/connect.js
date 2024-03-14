import net from "node:net";
import ansiColors from "../utils/terminal/ansiColors.js";
import ansiEraseLine from "../utils/terminal/ansiEraseLine.js";

const input = process.stdin;
const output = process.stdout;

const BORDER = "****************";
const MSG = "*   Chat App   *";

const connect = ({ host, port, roomOptions }) => {
  const client = net.createConnection(
    {
      port,
      host,
      message: roomOptions.options[roomOptions.selectedIndex],
      keepAlive: true,
    },
    () => {
      // Clear previous messages
      output.write(ansiEraseLine(3) + "\n");

      // Showing app name
      console.log(ansiColors(BORDER));
      console.log(MSG);
      console.log(ansiColors(BORDER));

      //   Sending this message to server and in response will get all rooms
      client.write(
        JSON.stringify({ isNewClient: true, message: "New client connected!" })
      );
    }
  );

  client.on("data", (data) => {
    data = JSON.parse(data.toString());
    if (roomOptions.isFirstTimeShow) {
      // First time getting data from server and populating all room options
      roomOptions.options = data.rooms;
      // Adding new entry to options to create new room
      roomOptions.options.push("create new");
      roomOptions.init(client);
    } else {
      // If room was created by current user then updating roomOptions
      if (data.isNewlyCreatedRoom) {
        roomOptions.options = data.allRooms;
        roomOptions.selectedIndex = roomOptions.options.indexOf(data.room);
      }
      // Consoling formatted message for client
      output.write(
        `${ansiColors(
          `${data.room} - ${data.remoteAddress} ${data.remotePort}`,
          "blue"
        )}    ${data.message}\n`
      );
    }
  });

  // Event that gets triggered when client type message and hit Enter
  input.on("data", (data) => {
    // If user has joined then send message from selected room to server
    if (roomOptions.isOptionSelected) {
      data = data.toString();
      // Formatting user's entered message
      //Moving cursor to previous line
      process.stdout.moveCursor(0, -1);
      // clearing content of the line
      process.stdout.clearLine(1);
      // Writing formatted message
      output.write(
        `${ansiColors(
          `User - ${client.localAddress} ${client.localPort}`,
          "yellow"
        )}    ${data}`
      );

      // Message send to server
      client.write(
        JSON.stringify({
          message: data.replace("\n", ""),
          room: roomOptions.options[roomOptions.selectedIndex],
        })
      );
    }
  });

  client.on("error", (error) => {
    console.log("Error: ", error);
  });

  client.on("end", () => {
    console.log("Client Disconnected!");
  });
};

export default connect;
