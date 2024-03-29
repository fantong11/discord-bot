const Discord = require("discord.js");
const IEvent = require("../helpers/IEvent");
const CommandManager = require("../helpers/CommandManager");
const { prefix } = require("../../config.js");

class Message extends IEvent {
    constructor() {
        super("message", false);
        this.commandManager = new CommandManager();
    }

    execute(message) {
        // 沒有prefix或是傳訊息的是機器人就回傳
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        // 拿掉前面prefix的長度
        const commandBody = message.content.slice(prefix.length);
        // 分割字串
        const args = commandBody.split(" ");
        // 陣列左移再變小寫
        const commandName = args.shift().toLowerCase();

        const Command = this.commandIsExist(message.client.commands, commandName);

        if (!Command) return;

        const command = new Command();

        // guildOnly的指令和私訊沒辦法執行
        if (command.guildOnly && message.channel.type === 'dm') {
            return message.reply("I can't execute that command inside DMs!");
        }
        // 指令有權限的話去找傳訊息的人有沒有權限
        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return message.reply("You can not do this!");
            }
        }

        // 判斷指令需不需要參數
        if (command.argsIsRequired && !args.length) {
            let reply = (`You didn't provide and arguments, ${message.author}!`);

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
        }
        // 訊息冷卻時間
        const cooldowns = new Discord.Collection();

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        // 執行指令
        try {
            command.setMessageAndArgs(message, args);
            this.commandManager.executeCmd(command);
            // command.execute(message, args);
        }
        catch (error) {
            console.log(error);
            message.reply("There was an error trying to execute that command!");
        }

    }

    commandIsExist(commands, commandName) {
        const Command = commands.get(commandName)
            || commands.find(Command => new Command().aliases && new Command().aliases.includes(commandName));

        return Command;
    }
}

module.exports = Message;