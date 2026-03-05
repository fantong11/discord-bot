const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs   = require('fs');
const path = require('path');

class DiscordBot {
    constructor(config) {
        this.config = config;
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent,   // privileged — enable in Discord Dev Portal
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildMessageReactions,
            ],
        });
        this.client.commands = new Collection();
        // client.useCases is injected by the composition root before run() is called.
    }

    run() {
        this._loadCommands();
        this._loadEvents();
        this.client.login(this.config.token);
    }

    _loadCommands() {
        const root = path.join(__dirname, '../commands');
        for (const category of ['general', 'music', 'moderation', 'admin']) {
            const dir = path.join(root, category);
            if (!fs.existsSync(dir)) continue;
            for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.js'))) {
                const CommandClass = require(path.join(dir, file));
                this.client.commands.set(file.replace('.js', ''), CommandClass);
            }
        }
    }

    _loadEvents() {
        const dir = path.join(__dirname, '../events');
        for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.js') && f !== 'IEvent.js')) {
            const EventClass = require(path.join(dir, file));
            const event      = new EventClass(this.client, this.config);
            this.client[event.once ? 'once' : 'on'](event.name, (...args) => event.execute(...args));
        }
    }
}

module.exports = DiscordBot;
