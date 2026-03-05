const { ChannelType } = require('discord.js');
const Handler     = require('./Handler');
const EmbedHelper = require('../../../../../shared/helpers/EmbedHelper');

class GuildOnlyHandler extends Handler {
    handle(context) {
        const { command, message } = context;
        if (command.guildOnly && message.channel.type === ChannelType.DM) {
            EmbedHelper.sendError(message.channel, 'Server Only', 'This command can only be used in a server, not in DMs.');
            return false;
        }
        return super.handle(context);
    }
}

module.exports = GuildOnlyHandler;
