module.exports = {
    name: "tag",
    description: "Tag someone.",
    args: true,
    usage: "[User] [number]",
    cooldowns: 5,
    execute(message, args) {
        const userId = args[0];
        const times = args[1];
        for (let i = 0; i < times; i++) {
            message.channel.send(userId);
        }
    },
}