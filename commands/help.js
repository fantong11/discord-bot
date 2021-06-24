const { prefix } = require("../config.js");
const Command = require("../helpers/Command");

class Help extends Command {
    constructor() {
        super("help", "List all of my commands of info about a specific command.")
        this.usage = "[command name]";
        this.aliases = ["commands", "h"];
        this.cooldowns = 5;
    }

    execute() {
        const data = [];
        const { commands } = this.message.client;

        if (!this.args.length) {
            data.push("Here's a list of all my commands:");
            data.push(commands.map(command => command.name).join(", "));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

            // 傳送訊息到私人聊天室
            return this.message.author.send(data, { split: true })
                .then(() => {
                    if (this.message.channel.type === "dm") return;
                    this.message.reply("I've sent you a DM with all my commands!");
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${this.message.author.tag}.\n`, error);
                    this.message.reply("it seems like I can't DM you! Do you have DMs disabled?");
                });
        }

        // 取得指令名字
        const name = this.args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return this.message.reply("that's not a valid command!");
        }

        // module裡有可能會沒有的選項先用if判斷再push，像是name因為一定會有所以不用加
        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(", ")}`);
        if (command.description) data.push(`**description:** ${command.description}`);
        if (command.usage) data.push(`**usage:** ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        this.message.channel.send(data, { split: true });
    }
}

module.exports = Help;