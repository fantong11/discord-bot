class Command {
    constructor() {
        this.name = name;
        this.description = description;
        this.usage = usage;
    }

    execute(message, args) {
        throw new Error("Method execute() must be implemented.");
    }
}

module.exports = Command;