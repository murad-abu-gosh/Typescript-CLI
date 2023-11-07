"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandProcessor_1 = require("./CommandProcessor");
const commandProcessor = new CommandProcessor_1.CommandProcessor();
function runCLI() {
    commandProcessor.printMenu();
    commandProcessor.processCommands();
}
runCLI();
