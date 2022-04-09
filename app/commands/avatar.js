const Discord = require("discord.js");
const Command = require("../helpers/Command");

class Avatar extends Command {
    constructor() {
        super("avatar", "Show your avatar")
        this.aliases = ["icon", "pfp"];
    }

    execute() {
        const embed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Avatar")
            .setAuthor(this.message.author.username, this.message.author.displayAvatarURL())
            .setImage(this.message.author.displayAvatarURL())
            .setTimestamp();
        this.message.channel.send(embed);
    }
}

module.exports = Avatar;