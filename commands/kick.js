const Command = require("../helpers/Command");

class Kick extends Command {
    constructor() {
        super("kick", "Kick a user from the server.")
        this.argsIsRequired = true;
        this.usage = "[User]";
        this.guildOnly = true;
        this.permission = "KICK_MEMBERS";
    }

    execute() {
        const user = args[0];
        // 踢掉使用者
        user.kicked()
            .then(() => {
                this.message.channel.send("Bye bye!");
            })
            .catch((error) => {
                console.error(error);
                this.message.channel.send("You didn't mention a user or something wrong");
            });
    }
}

module.exports = Kick;