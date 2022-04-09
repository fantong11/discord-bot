const Command = require("../helpers/Command");

class Tag extends Command {
    constructor() {
        super("tag", "Tag someone.")
        this.argsIsRequired = true;
        this.usage = "[User] [number]";
        this.cooldowns = 5;
    }

    execute() {
        const userId = this.args[0];
        const times = this.args[1];
        for (let i = 0; i < times; i++) {
            this.message.channel.send(userId);
        }
    }
}

module.exports = Tag;