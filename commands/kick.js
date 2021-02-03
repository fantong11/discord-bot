const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "kick",
    description: "Kick a user from the server.",
    args: true,
    usage: "[User]",
    guildOnly: true,
    permission: "KICK_MEMBERS",
    execute(message, args) {
        const user = args[0];
        // 踢掉使用者
        user.kicked()
            .then(() => {
                message.channel.send("Bye bye!");
            })
            .catch((error) => {
                console.error(error);
                message.channel.send("You didn't mention a user or something wrong");
            });
    }
}