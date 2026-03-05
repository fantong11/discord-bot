const IEvent = require("../helpers/IEvent");

class Reconnecting extends IEvent {
    constructor() {
        super("shardReconnecting", false); // v12: "reconnecting" → v14: "shardReconnecting"
    }

    execute(shardId) {
        console.log(`[Shard ${shardId}] Reconnecting…`);
    }
}

module.exports = Reconnecting;
