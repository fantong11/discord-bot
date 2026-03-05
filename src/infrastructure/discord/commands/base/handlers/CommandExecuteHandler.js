const Handler     = require('./Handler');
const EmbedHelper = require('../../../../../shared/helpers/EmbedHelper');

class CommandExecuteHandler extends Handler {
    constructor(commandManager) {
        super();
        this.commandManager = commandManager;
    }

    handle(context) {
        const { command, message, args } = context;
        command.setMessageAndArgs(message, args);
        // Wrap in Promise.resolve so async execute() errors are also caught.
        Promise.resolve(this.commandManager.executeCmd(command)).catch((error) => {
            console.error('[Command Error]', error);
            EmbedHelper.sendError(message.channel, 'Command Error', 'Something went wrong. Please try again.');
        });
        return true;
    }
}

module.exports = CommandExecuteHandler;
