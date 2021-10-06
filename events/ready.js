const IEvent = require("../helpers/IEvent")

class Ready extends IEvent {
    constructor() {
        super("ready", true);
    }

    execute(message) {
        console.log("Ready!");
    }
}

module.exports = Ready;