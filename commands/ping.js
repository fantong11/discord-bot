module.exports = {
    name: "ping",
    description: "Ping!",
    execute(message, args) {
        // 目前時間 - 訊息建立時間 = 延遲時間
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`${timeTaken}ms`);
    }
}