const Command = require("../helpers/Command");

class Ping extends Command {
    constructor() {
        super("ping", "Ping!!")
    }

    execute() {
        // 目前時間 - 訊息建立時間 = 延遲時間
        const timeTaken = Date.now() - this.message.createdTimestamp;
        this.message.reply(`${timeTaken}ms`);
    }
}

module.exports = Ping;