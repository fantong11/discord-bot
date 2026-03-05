const IEvent            = require('./IEvent');
const CommandManager    = require('../commands/base/CommandManager');
const CommandResolver   = require('../commands/base/CommandResolver');
const GuildOnlyHandler  = require('../commands/base/handlers/GuildOnlyHandler');
const PermissionHandler = require('../commands/base/handlers/PermissionHandler');
const ArgsHandler       = require('../commands/base/handlers/ArgsHandler');
const CooldownHandler   = require('../commands/base/handlers/CooldownHandler');
const CommandExecuteHandler = require('../commands/base/handlers/CommandExecuteHandler');

class MessageCreateEvent extends IEvent {
    constructor(client, config) {
        super('messageCreate', false, client, config);
        this.commandManager  = new CommandManager();
        this.commandResolver = new CommandResolver();
        this.cooldowns       = new Map();
        this._buildHandlerChain();
    }

    _buildHandlerChain() {
        const guildOnly  = new GuildOnlyHandler();
        const permission = new PermissionHandler();
        const args       = new ArgsHandler(this.config.prefix);
        const cooldown   = new CooldownHandler(this.cooldowns);
        const execute    = new CommandExecuteHandler(this.commandManager);

        guildOnly.setNext(permission).setNext(args).setNext(cooldown).setNext(execute);
        this.handlerChain = guildOnly;
    }

    execute(message) {
        if (!message.content.startsWith(this.config.prefix) || message.author.bot) return;

        const commandBody = message.content.slice(this.config.prefix.length);
        const args        = commandBody.split(' ');
        const commandName = args.shift().toLowerCase();

        const CommandClass = this.commandResolver.resolve(this.client.commands, commandName);
        if (!CommandClass) return;

        const command = new CommandClass(this.client);
        this.handlerChain.handle({ command, message, args });
    }
}

module.exports = MessageCreateEvent;
