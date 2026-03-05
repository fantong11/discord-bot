const IEvent = require("../helpers/IEvent");
const { prefix } = require("../../config");

class Ready extends IEvent {
    constructor() {
        super("clientReady", true);
    }

    execute() {
        const { user, guilds } = this.client;
        user.setActivity(`${prefix}help | ${guilds.cache.size} server(s)`, { type: "WATCHING" });
        console.log(`[Ready] Logged in as ${user.tag} — serving ${guilds.cache.size} server(s)`);
    }
}

module.exports = Ready;
