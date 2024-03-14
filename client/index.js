import ansiColors from "./utils/terminal/ansiColors.js";
import SelectOptions from "./utils/terminal/SelectOptions.js";
import connect from "./chat/connect.js";

const input = process.stdin;

const roomOptions = new SelectOptions();

// Start by entering IP address and port
const startClient = () => {
  console.log(
    ansiColors(
      "Please enter the IP address followed by a colon (:) and the port number e.g.(192.168.1.100:3000)!",
      "yellow"
    )
  );

  // This event listner is used to read ip address and port no of server after that it is removed
  input.on("data", getAddressDataHandler);
  function getAddressDataHandler(data) {
    data = data.toString();
    if (!data.includes(":")) {
      console.log(ansiColors("Please enter valid address!", "red"));
    } else {
      const [host, port] = data.split(":");
      //   Removing event listerner once ip address and port is read
      input.off("data", getAddressDataHandler);
      //  Connet to server after getting host and port from user
      connect({ host, port, roomOptions });
    }
  }
};

// Starting Client
startClient();

// To gracefully shutdown client
process.on("SIGINT", () => {
  // This will send signal to server
  roomOptions.client.destroy();

  console.log("Closing chat app!");
});
