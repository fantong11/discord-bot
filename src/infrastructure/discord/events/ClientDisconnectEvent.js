const IEvent = require('./IEvent');

class ClientDisconnectEvent extends IEvent {
    constructor(client, config) {
        super('shardDisconnect', false, client, config);
    }

    execute(closeEvent, shardId) {
        console.log(`[Shard ${shardId}] Disconnected (code: ${closeEvent.code})`);
    }
}

module.exports = ClientDisconnectEvent;
