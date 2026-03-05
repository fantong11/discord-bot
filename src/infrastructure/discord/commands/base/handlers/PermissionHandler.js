const Handler     = require('./Handler');
const EmbedHelper = require('../../../../../shared/helpers/EmbedHelper');

class PermissionHandler extends Handler {
    handle(context) {
        const { command, message } = context;
        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                EmbedHelper.sendError(message.channel, 'Permission Denied', "You don't have the required permissions to use this command.");
                return false;
            }
        }
        return super.handle(context);
    }
}

module.exports = PermissionHandler;
