const Handler     = require('./Handler');
const EmbedHelper = require('../../../../../shared/helpers/EmbedHelper');

class ArgsHandler extends Handler {
    constructor(prefix) {
        super();
        this.prefix = prefix;
    }

    handle(context) {
        const { command, message, args } = context;
        if (command.argsIsRequired && !args.length) {
            const description = command.usage
                ? `Proper usage: \`${this.prefix}${command.name} ${command.usage}\``
                : 'Please provide the required arguments.';
            EmbedHelper.sendError(message.channel, 'Missing Arguments', description);
            return false;
        }
        return super.handle(context);
    }
}

module.exports = ArgsHandler;
