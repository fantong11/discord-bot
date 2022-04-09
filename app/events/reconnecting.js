const IEvent = require("../helpers/IEvent")

class Reconnecting extends IEvent {
    constructor() {
        super("reconnecting", true);
    }

    execute(message) {
        console.log("Reconnecting!");
    }
}

module.exports = Reconnecting;