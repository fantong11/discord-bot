const Event = require("../helpers/Event")

class Reconnecting extends Event {
    constructor() {
        super("reconnecting", true);
    }

    execute(message) {
        console.log("Reconnecting!");
    }
}

module.exports = Reconnecting;