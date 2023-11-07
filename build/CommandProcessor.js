"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandProcessor = void 0;
const Command_1 = require("./Command");
const prompter = require("prompt-sync")();
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
class CommandProcessor {
    constructor() {
        this.commands = [
            new Command_1.Command('1', 'Palindrome - Check if the input is a palindrome', this.isPalindrome),
            new Command_1.Command('2', 'Lower - Check if all characters in the input are lowercase', this.isLowercase),
            new Command_1.Command('3', 'Digits - Check if all characters in the input are digits', this.isDigits),
            new Command_1.Command('4', 'Armstrong - Check if the input is an \"Armstrong Number\"', this.isArmstrongNumber),
            new Command_1.Command('5', 'Nationalize - Check the nationality probability of a given first name', this.nationalize),
            new Command_1.Command('6', 'Exit - Exit from the application', this.exit),
        ];
    }
    printMenu() {
        console.log('The available commands are:');
        this.commands.forEach((command) => {
            console.log(`${command.id} - ${command.name}`);
        });
    }
    processCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            let userInput = '';
            const enterInputMessage = 'Enter the input: ';
            const answerMessage = 'The answer is:';
            while (userInput !== '6') {
                this.printMenu();
                userInput = prompter('Enter the number of the command: ');
                if (userInput === '6')
                    break;
                const selectedCommand = this.commands.find((command) => command.id === userInput);
                if (selectedCommand) {
                    const input = prompter(enterInputMessage);
                    let result;
                    result = yield selectedCommand.execute(input);
                    console.log(answerMessage, result);
                }
                else {
                    console.log('Invalid command. Please choose a valid option.');
                }
            }
            console.log('Exiting the CLI.');
        });
    }
    isPalindrome(input) {
        const reversed = input.split("").reverse().join("");
        return input === reversed;
    }
    isLowercase(input) {
        for (let i = 0; i < input.length; i++) {
            if (input.charCodeAt(i) < 97 || input.charCodeAt(i) > 122) {
                return false;
            }
        }
        return true;
    }
    isDigits(input) {
        for (let i = 0; i < input.length; i++) {
            if (input.charCodeAt(i) < 48 || input.charCodeAt(i) > 57) {
                return false;
            }
        }
        return true;
    }
    isArmstrongNumber(input) {
        const num = parseInt(input);
        const digits = input.length;
        let sum = 0;
        let temp = num;
        while (temp > 0) {
            const digit = temp % 10;
            sum += Math.pow(digit, digits);
            temp = Math.floor(temp / 10);
        }
        return num === sum;
    }
    nationalize(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let formattedResult = ``;
            try {
                const response = yield axios_1.default.get(`https://api.nationalize.io/?name=${name}`);
                const nationalityData = response.data.country;
                if (nationalityData.length === 0) {
                    console.log(`No nationality data found for ${name}`);
                    return '';
                }
                nationalityData.sort((a, b) => b.probability - a.probability);
                const countriesJSON = fs_1.default.readFileSync('countries.json', 'utf8');
                const countryMap = JSON.parse(countriesJSON);
                const mostProbableNationality = nationalityData[0];
                const countryName = countryMap[mostProbableNationality.country_id];
                // Format and print the result
                formattedResult = `${countryName} ${mostProbableNationality.probability * 100}%`;
            }
            catch (error) {
                console.error('An error occurred:', error);
            }
            return formattedResult;
        });
    }
    exit(input) {
        return true;
    }
}
exports.CommandProcessor = CommandProcessor;
