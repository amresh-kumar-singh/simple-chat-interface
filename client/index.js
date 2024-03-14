import net from "node:net";
import readline from "node:readline";
import ansiColors from "./utils/terminal/ansiColors.js";
import ansiEraseLine from "./utils/terminal/ansiEraseLine.js";
import SelectOptions from "./utils/terminal/SelectOptions.js";

const PORT = 3000;
let host, port;
const input = process.stdin;
const output = process.stdout;

const selectOptions = new SelectOptions();
// selectOptions.selectedIndex = 0;
// selectOptions.isFirstTimeShow = true;
// selectOptions.selector = "*";
// selectOptions.options = ["Mango", "Banana"];

// selectOptions.init = () => {
//   const question = "Please select a room to join, Else create new one.\n";
//   console.log(ansiColors(question, "blue"));

//   readline.emitKeypressEvents(input);
//   selectOptions.start();
// };

// selectOptions.start = () => {
//   input.setRawMode(true);
//   input.resume();

//   input.on("keypress", onKeyPressHandler);
//   selectOptions.createOptionMenu();
// };

// function onKeyPressHandler(_, key) {
//   const optionsLength = selectOptions.options.length;
//   switch (key.name) {
//     case "down":
//       if (selectOptions.selectedIndex < optionsLength) {
//         selectOptions.selectedIndex =
//           (selectOptions.selectedIndex + 1) % optionsLength;
//         // process.stdout.moveCursor(0, -optionsLength);
//         // for (let i = 0; i < selectOptions.selectedIndex; i++) {
//         //   process.stdout.clearLine(1);
//         // }
//         selectOptions.createOptionMenu();
//         break;
//       }
//     case "up":
//       if (selectOptions.selectedIndex > -1) {
//         selectOptions.selectedIndex =
//           selectOptions.selectedIndex - 1 < 0
//             ? optionsLength - 1
//             : selectOptions.selectedIndex - 1;
//         // process.stdout.moveCursor(0, -optionsLength);

//         // for (let i = 0; i < selectOptions.selectedIndex; i++) {
//         //   process.stdout.clearLine(1);
//         // }
//         selectOptions.createOptionMenu();

//         break;
//       }
//     case "return":
//       console.log(
//         "slectionoption",
//         selectOptions.options[selectOptions.selectedIndex]
//       );
//       input.setRawMode(false);
//       input.off("keypress", onKeyPressHandler);
//       //   input.removeAllListeners();
//       client.write(
//         JSON.stringify({
//           join: true,
//           room: selectOptions.options[selectOptions.selectedIndex],
//         })
//       );
//       isRoomJoined = true;
//       break;
//     case "escape":
//     case "c":
//       if (key.ctrl) selectOptions.close();
//     //   console.log("close", key);
//   }
// }
// selectOptions.close = () => {
//   input.setRawMode(false);
//   input.pause();
//   process.exit(0);
// };
// selectOptions.createOptionMenu = () => {
//   const optionsLength = selectOptions.options.length;
//   if (selectOptions.isFirstTimeShow) selectOptions.isFirstTimeShow = false;
//   else output.write(ansiEraseLine(optionsLength));

//   const padding = selectOptions.getPadding(10);
//   const cursorColor = ansiColors(selectOptions.selector, "green");

//   for (let i = 0; i < optionsLength; i++) {
//     const selectedOption =
//       i == selectOptions.selectedIndex
//         ? `${cursorColor} ${selectOptions.options[i]}`
//         : selectOptions.options[i];
//     const ending = i != optionsLength - 1 ? "\n" : "";
//     output.write(padding + selectedOption + ending);
//   }
// };

// selectOptions.getPadding = (len = 10) => {
//   let text = " ";
//   for (let i = 0; i < len; i++) {
//     text += " ";
//   }
//   return text;
// };

// Start by entering IP address and port
const startClient = () => {
  console.log(
    ansiColors("Please enter IP address followed by : and port no!", "yellow")
  );

  input.on("data", onDataHandler);
  function onDataHandler(data) {
    data = data.toString();
    if (!data.includes(":")) {
      console.log(ansiColors("Please enter valid address!", "red"));
    } else {
      [host, port] = data.split(":");
      //   Removing event listerner
      input.off("data", onDataHandler);
      //  Connet to server after getting host and port from user
      connect(host, port);
    }
  }
};

const connect = (host, port) => {
  // Assigingin client to already declare variable so that client as be accessed anywhere
  client = net.createConnection(
    { port, host, message: selectOptions.options[selectOptions.selectedIndex] },
    () => {
      console.log(ansiColors("Connection established!!"));
      //   Sending this message to server and in response will get all rooms
      client.write(
        JSON.stringify({ isNewClient: true, message: "New client connected!" })
      );
    }
  );

  client.on("data", (data) => {
    data = JSON.parse(data.toString());
    if (selectOptions.isFirstTimeShow) {
      selectOptions.options = data.rooms;
      selectOptions.options.push("create new");
      selectOptions.init(client);
    } else {
      if (data.isNewlyCreatedRoom) {
        selectOptions.options = data.allRooms;
        selectOptions.selectedIndex = selectOptions.options.indexOf(data.room);
      }
      console.log(
        `${ansiColors(
          `${data.room} - ${data.remoteAddress} ${data.remotePort}`,
          "blue"
        )}    ${data.message}`
      );
    }
  });

  input.on("data", (data) => {
    // If user has joined then send message to selected room
    if (selectOptions.isOptionSelected) {
      client.write(
        JSON.stringify({
          message: data.toString(),
          room: selectOptions.options[selectOptions.selectedIndex],
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

startClient();
process.on("SIGINT", () => {
  console.log("sing");
});
