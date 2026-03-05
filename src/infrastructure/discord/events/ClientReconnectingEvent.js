const IEvent = require('./IEvent');

class ClientReconnectingEvent extends IEvent {
    constructor(client, config) {
        super('shardReconnecting', false, client, config);
    }

    execute(shardId) {
        console.log(`[Shard ${shardId}] Reconnecting…`);
    }
}

module.exports = ClientReconnectingEvent;
