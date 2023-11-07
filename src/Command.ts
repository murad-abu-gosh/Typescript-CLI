export class Command {
    constructor(
        public id: string,
        public name: string,
        private action: (input: string) => boolean | Promise<string>
    ) {}

    public execute(input: string): boolean | Promise<string> {
        return this.action(input);
    }
}
