import { CommandProcessor } from './CommandProcessor';

const commandProcessor = new CommandProcessor();

function runCLI() {
    commandProcessor.printMenu();
    commandProcessor.processCommands();
}

runCLI();
