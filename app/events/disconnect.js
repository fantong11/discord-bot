const IEvent = require("../helpers/IEvent")

class Disconnect extends IEvent {
    constructor() {
        super("disconnect", true);
    }

    execute(message) {
        console.log("Disconnect!");
    }
}

module.exports = Disconnect;