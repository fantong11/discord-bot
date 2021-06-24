const { prefix } = require("../config.js");

module.exports = {
    name: "help",
    description: "List all of my commands of info about a specific command.",
    aliases: ["commands", "h"],
    usage: "[command name]",
    cooldown: 5,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push("Here's a list of all my commands:");
            data.push(commands.map(command => command.name).join(", "));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

            // 傳送訊息到私人聊天室
            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === "dm") return;
                    message.reply("I've sent you a DM with all my commands!");
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply("it seems like I can't DM you! Do you have DMs disabled?");
                });
        }

        // 取得指令名字
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply("that's not a valid command!");
        }

        // module裡有可能會沒有的選項先用if判斷再push，像是name因為一定會有所以不用加
        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(", ")}`);
        if (command.description) data.push(`**description:** ${command.description}`);
        if (command.usage) data.push(`**usage:** ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, { split: true });
    }
}