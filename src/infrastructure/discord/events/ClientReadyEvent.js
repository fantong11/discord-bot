const IEvent = require('./IEvent');

class ClientReadyEvent extends IEvent {
    constructor(client, config) {
        super('clientReady', true, client, config);
    }

    execute() {
        const { user, guilds } = this.client;
        user.setActivity(`${this.config.prefix}help | ${guilds.cache.size} server(s)`, { type: 'WATCHING' });
        console.log(`[Ready] Logged in as ${user.tag} — serving ${guilds.cache.size} server(s)`);
    }
}

module.exports = ClientReadyEvent;
