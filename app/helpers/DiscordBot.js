const { Client, Collection, GatewayIntentBits } = require("discord.js");
const FileManager = require("./FileManager");
const { token } = require("../../config");

// Singleton pattern: guarantees one Discord client across the entire app.
class DiscordBot {
    constructor() {
        if (DiscordBot._instance) {
            return DiscordBot._instance;
        }

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
        this.client.events = new Collection();
        this.client.queue = new Map();
        this.fileManager = new FileManager();

        DiscordBot._instance = this;
    }

    run() {
        const commandFiles = this.fileManager.importScriptFromFolder("commands");
        const eventFiles = this.fileManager.importScriptFromFolder("events");

        this._loadCommands(commandFiles);
        this._loadEvents(eventFiles);
        this.client.login(token);
    }

    _loadCommands(commandFiles) {
        for (const file of commandFiles) {
            const Command = require(`../commands/${file}`);
            this.client.commands.set(file.replace(".js", ""), Command);
        }
    }

    _loadEvents(eventFiles) {
        for (const file of eventFiles) {
            const Event = require(`../events/${file}`);
            const event = new Event();
            event.client = this.client;
            this.client.events.set(event.name, event);
            this._registerEvent(event);
        }
    }

    _registerEvent(event) {
        const emitter =
            (typeof event.emitter === "string" ? this.client[event.emitter] : event.emitter)
            || this.client;
        try {
            emitter[event.once ? "once" : "on"](event.name, (...args) => event.execute(...args));
        } catch (error) {
            console.error(error.stack);
        }
    }
}

module.exports = DiscordBot;
