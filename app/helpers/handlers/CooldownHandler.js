const Handler = require("./Handler");
const EmbedHelper = require("../EmbedHelper");

class CooldownHandler extends Handler {
    // cooldowns Map is injected so it persists across messages (DIP + SRP).
    constructor(cooldowns) {
        super();
        this.cooldowns = cooldowns;
    }

    handle(context) {
        const { command, message } = context;

        if (!this.cooldowns.has(command.name)) {
            this.cooldowns.set(command.name, new Map());
        }

        const now = Date.now();
        const timestamps = this.cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
                EmbedHelper.sendError(
                    message.channel,
                    "Slow Down!",
                    `Please wait **${timeLeft}s** before using \`${command.name}\` again.`
                );
                return false;
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        return super.handle(context);
    }
}

module.exports = CooldownHandler;
