import {Command} from './Command';
const prompter = require("prompt-sync")();
import axios from 'axios';
import fs from 'fs';
export class CommandProcessor {
    private commands: Command[];

    constructor() {
        this.commands = [
            new Command('1', 'Palindrome - Check if the input is a palindrome', this.isPalindrome),
            new Command('2', 'Lower - Check if all characters in the input are lowercase', this.isLowercase),
            new Command('3', 'Digits - Check if all characters in the input are digits', this.isDigits),
            new Command('4', 'Armstrong - Check if the input is an \"Armstrong Number\"', this.isArmstrongNumber),
            new Command('5', 'Nationalize - Check the nationality probability of a given first name', this.nationalize),
            new Command('6', 'Exit - Exit from the application', this.exit),
        ];
    }

    public printMenu(): void {
        console.log('The available commands are:');
        this.commands.forEach((command) => {
            console.log(`${command.id} - ${command.name}`);
        });
    }

    public async processCommands(): Promise<void> {
        let userInput = '';
        const enterInputMessage = 'Enter the input: ';
        const answerMessage = 'The answer is:';

        while (userInput !== '6') {
            this.printMenu()
            userInput = prompter('Enter the number of the command: ')!;
            if (userInput === '6') break;
            const selectedCommand = this.commands.find((command) => command.id === userInput);

            if (selectedCommand) {
                const input: string = prompter(enterInputMessage)!;

                let result: string | boolean | Promise<string>;
                result = await selectedCommand.execute(input);
                console.log(answerMessage, result);
            } else {
                console.log('Invalid command. Please choose a valid option.');
            }
        }

        console.log('Exiting the CLI.');
    }

    private isPalindrome(input: string): boolean {
        const reversed = input.split("").reverse().join("");
        return input === reversed;
    }

    private isLowercase(input: string): boolean {
        for (let i = 0; i < input.length; i++) {
            if (input.charCodeAt(i) < 97 || input.charCodeAt(i) > 122) {
                return false;
            }
        }
        return true;
    }

    private isDigits(input: string): boolean {
        for (let i = 0; i < input.length; i++) {
            if (input.charCodeAt(i) < 48 || input.charCodeAt(i) > 57) {
                return false;
            }
        }
        return true;
    }

    private isArmstrongNumber(input: string): boolean {
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

    private async nationalize(name: string): Promise<string> {
        let formattedResult: string = ``
        try {
            const response = await axios.get(`https://api.nationalize.io/?name=${name}`);

            const nationalityData = response.data.country;

            if (nationalityData.length === 0) {
                console.log(`No nationality data found for ${name}`);
                return '';
            }

            nationalityData.sort((a: { probability: number; }, b: {
                probability: number;
            }) => b.probability - a.probability);

            const countriesJSON = fs.readFileSync('countries.json', 'utf8');
            const countryMap = JSON.parse(countriesJSON);

            const mostProbableNationality = nationalityData[0];
            const countryName = countryMap[mostProbableNationality.country_id];

            // Format and print the result
            formattedResult = `${countryName} ${mostProbableNationality.probability * 100}%`;
        } catch (error) {
            console.error('An error occurred:', error);
        }
        return formattedResult
    }

    private exit(input: string): boolean {
        return true
    }
}
