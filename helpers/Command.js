class Command {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    setMessageAndArgs(message, args) {
        this.message = message;
        this.args = args;
    }

    execute() {
        throw new Error("Method execute() must be implemented.");
    }
}

module.exports = Command;