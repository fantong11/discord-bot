const Discord = require("discord.js");
const FileManager = require("./FileManager");
const { token } = require("../config.js");

class DiscordBot {
    constructor() {
        this.client = new Discord.Client();
        this.client.commands = new Discord.Collection();
        this.client.events = new Discord.Collection();
        this.client.queue = new Map();
        this.fileManager = new FileManager();

    }

    run() {
        const commandFiles = this.fileManager.importScriptFromFolder("commands");
        const eventFiles = this.fileManager.importScriptFromFolder("events");

        this.setCommands(commandFiles);
        this.setEvents(eventFiles);
        this.client.login(token);
    }

    setCommands(commandFiles) {
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);

            // 一個指令名字對應一個指令檔案
            this.client.commands.set(command.name, command);
        }
    }

    setEvents(eventFiles) {
        for (const file of eventFiles) {
            const Event = require(`../events/${file}`);

            const event = new Event();
            this.client.events.set(event.name, event);
            this.onListen(event);
        }

    }

    onListen(event) {
        const emitter = (typeof event.emitter === "string" ? this.client[event.emitter] : event.emitter) || this.client;
        const once = event.once;
        console.log(event);
        try {
            emitter[once ? "once" : "on"](event.name, (...args) => event.execute(...args));
        } catch (error) {
            console.error(error.stack);
        }
    }
}

module.exports = DiscordBot