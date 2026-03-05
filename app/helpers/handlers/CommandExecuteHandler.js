const Handler = require("./Handler");
const EmbedHelper = require("../EmbedHelper");

class CommandExecuteHandler extends Handler {
    constructor(commandManager) {
        super();
        this.commandManager = commandManager;
    }

    handle(context) {
        const { command, message, args } = context;
        try {
            command.setMessageAndArgs(message, args);
            this.commandManager.executeCmd(command);
        } catch (error) {
            console.error(error);
            EmbedHelper.sendError(
                message.channel,
                "Command Error",
                "Something went wrong while executing that command. Please try again."
            );
        }
        return true;
    }
}

module.exports = CommandExecuteHandler;
