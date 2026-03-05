class IEvent {
    constructor(name, once) {
        if (this.constructor === IEvent) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.name = name;
        this.once = once;
        this.client = null; // injected by DiscordBot._loadEvents
    }

    execute(...args) {
        throw new Error("Method execute() must be implemented.");
    }
}

module.exports = IEvent;
