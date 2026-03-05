class IEvent {
    constructor(name, once, client, config) {
        this.name   = name;
        this.once   = once;
        this.client = client;
        this.config = config;
    }

    execute(...args) { throw new Error('Method execute() must be implemented.'); }
}

module.exports = IEvent;
