class Event {
    constructor(name, once) {
        if (this.constructor == Event) {
            throw new Error("Abstract classes can't be instantiated.");
        }

        this.name = name;
        this.once = once;
    }

    execute(message) {
        throw new Error("Method execute() must be implemented.");
    }

}

module.exports= Event