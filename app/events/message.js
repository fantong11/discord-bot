const IEvent = require("../helpers/IEvent");
const CommandManager = require("../helpers/CommandManager");
const CommandResolver = require("../helpers/CommandResolver");
const GuildOnlyHandler = require("../helpers/handlers/GuildOnlyHandler");
const PermissionHandler = require("../helpers/handlers/PermissionHandler");
const ArgsHandler = require("../helpers/handlers/ArgsHandler");
const CooldownHandler = require("../helpers/handlers/CooldownHandler");
const CommandExecuteHandler = require("../helpers/handlers/CommandExecuteHandler");
const { prefix } = require("../../config.js");

class Message extends IEvent {
    constructor() {
        super("messageCreate", false); // v12: "message" → v14: "messageCreate"
        this.commandManager = new CommandManager();
        this.commandResolver = new CommandResolver();
        this.cooldowns = new Map();
        this._buildHandlerChain();
    }

    _buildHandlerChain() {
        const guildOnly = new GuildOnlyHandler();
        const permission = new PermissionHandler();
        const args = new ArgsHandler();
        const cooldown = new CooldownHandler(this.cooldowns);
        const execute = new CommandExecuteHandler(this.commandManager);

        guildOnly.setNext(permission).setNext(args).setNext(cooldown).setNext(execute);
        this.handlerChain = guildOnly;
    }

    execute(message) {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const commandBody = message.content.slice(prefix.length);
        const args = commandBody.split(" ");
        const commandName = args.shift().toLowerCase();

        const CommandClass = this.commandResolver.resolve(message.client.commands, commandName);
        if (!CommandClass) return;

        const command = new CommandClass();
        this.handlerChain.handle({ command, message, args });
    }
}

module.exports = Message;
