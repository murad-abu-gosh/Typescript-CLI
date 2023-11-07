"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    constructor(id, name, action) {
        this.id = id;
        this.name = name;
        this.action = action;
    }
    execute(input) {
        return this.action(input);
    }
}
exports.Command = Command;
