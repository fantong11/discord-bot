const IEvent = require("../helpers/IEvent");

class Disconnect extends IEvent {
    constructor() {
        super("shardDisconnect", false); // v12: "disconnect" → v14: "shardDisconnect"
    }

    execute(closeEvent, shardId) {
        console.log(`[Shard ${shardId}] Disconnected (code: ${closeEvent.code})`);
    }
}

module.exports = Disconnect;
