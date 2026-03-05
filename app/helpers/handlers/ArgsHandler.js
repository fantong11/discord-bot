const Handler = require("./Handler");
const EmbedHelper = require("../EmbedHelper");
const { prefix } = require("../../../config");

class ArgsHandler extends Handler {
    handle(context) {
        const { command, message, args } = context;
        if (command.argsIsRequired && !args.length) {
            const description = command.usage
                ? `Proper usage: \`${prefix}${command.name} ${command.usage}\``
                : "Please provide the required arguments.";
            EmbedHelper.sendError(message.channel, "Missing Arguments", description);
            return false;
        }
        return super.handle(context);
    }
}

module.exports = ArgsHandler;
