const Event = require("../helpers/Event")

class Disconnect extends Event {
    constructor() {
        super("disconnect", true);
    }

    execute(message) {
        console.log("Disconnect!");
    }
}

module.exports = Disconnect;