const Discord = require("discord.js");

module.exports = {
    name: "avatar",
    description: "Show your avatar",
    aliases: ["icon", "pfp"],
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Avatar")
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setImage(message.author.displayAvatarURL())
            .setTimestamp();
        message.channel.send(embed);
    }
}