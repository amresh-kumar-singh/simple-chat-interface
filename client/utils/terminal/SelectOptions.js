import readline from "node:readline";
import ansiColors from "./ansiColors.js";
import ansiEraseLine from "./ansiEraseLine.js";
const input = process.stdin;
const output = process.stdout;
export default class {
  constructor(input, output) {
    this.selectedIndex = 0;
    this.isFirstTimeShow = true;
    this.selector = "*";
    this.options = [];
    this.onKeyPressHandler = this.onKeyPressHandler.bind(this);
    this.client = null;
    this.isOptionSelected = false;
  }

  //
  init(client) {
    const question = "Please select a room to join, Else create new one.\n";
    console.log(ansiColors(question, "blue"));
    readline.emitKeypressEvents(input);
    this.start();
    this.client = client;
  }

  //
  start() {
    input.setRawMode(true);
    input.resume();

    input.on("keypress", this.onKeyPressHandler);
    this.createOptionMenu();
  }

  //
  onKeyPressHandler(_, key) {
    const optionsLength = this.options.length;
    switch (key.name) {
      case "down":
        if (this.selectedIndex < optionsLength) {
          this.selectedIndex = (this.selectedIndex + 1) % optionsLength;
          // process.stdout.moveCursor(0, -optionsLength);
          // for (let i = 0; i < this.selectedIndex; i++) {
          //   process.stdout.clearLine(1);
          // }
          this.createOptionMenu();
          break;
        }
      case "up":
        if (this.selectedIndex > -1) {
          this.selectedIndex =
            this.selectedIndex - 1 < 0
              ? optionsLength - 1
              : this.selectedIndex - 1;
          // process.stdout.moveCursor(0, -optionsLength);

          // for (let i = 0; i < this.selectedIndex; i++) {
          //   process.stdout.clearLine(1);
          // }
          this.createOptionMenu();

          break;
        }
      case "return":
        console.log("slectionoption", this.options[this.selectedIndex]);
        input.setRawMode(false);
        input.off("keypress", this.onKeyPressHandler);
        //   input.removeAllListeners();
        this.client.write(
          JSON.stringify({
            join: true,
            room: this.options[this.selectedIndex],
          })
        );
        this.isOptionSelected = true;
        break;
      case "escape":
      case "c":
        if (key.ctrl) this.close();
      //   console.log("close", key);
    }
  }

  //
  close() {
    input.setRawMode(false);
    input.pause();
    process.exit(0);
  }

  createOptionMenu() {
    const optionsLength = this.options.length;
    if (this.isFirstTimeShow) this.isFirstTimeShow = false;
    else output.write(ansiEraseLine(optionsLength));

    const padding = getPadding(10);
    const cursorColor = ansiColors(this.selector, "green");

    for (let i = 0; i < optionsLength; i++) {
      const selectedOption =
        i == this.selectedIndex
          ? `${cursorColor} ${this.options[i]}`
          : this.options[i];
      const ending = i != optionsLength - 1 ? "\n" : "";
      output.write(padding + selectedOption + ending);
    }
  }
}

function getPadding(len = 10) {
  let text = " ";
  for (let i = 0; i < len; i++) {
    text += " ";
  }
  return text;
}
