const Event = require("../helpers/Event")

class Ready extends Event {
    constructor() {
        super("ready", true);
    }

    execute(message) {
        console.log("Ready!");
    }
}

module.exports = Ready;