class Command {
    constructor(name, description) {
        if (this.constructor == Command) {
            throw new Error("Abstract classes can't be instantiated.");
        }

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