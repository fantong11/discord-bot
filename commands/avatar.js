module.exports = {
    name: "avatar",
    description: "Show your avatar",
    aliases: ["icon", "pfp"],
    execute(message, args) {
        message.reply(message.author.displayAvatarURL());
    }
}