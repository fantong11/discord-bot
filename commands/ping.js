module.exports = {
    name: "ping",
    description: "Ping!",
    args: false,
    execute(message, args) {
        const timeTaken = Date.now() - message.createdTimestamp;
        //message.reply(Date.now() + " " + message.createdTimestamp);
        message.reply(`${timeTaken}ms`);
    }
}