const IEvent      = require('./IEvent');
const EmbedHelper = require('../../../shared/helpers/EmbedHelper');

class InteractionCreateEvent extends IEvent {
    constructor(client, config) {
        super('interactionCreate', false, client, config);
    }

    execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const CommandClass = this.client.commands.get(interaction.commandName);
        if (!CommandClass) return;

        const command = new CommandClass(this.client);

        if (command.guildOnly && !interaction.guild) {
            return interaction.reply({
                embeds:    [EmbedHelper.error('Server Only', 'This command can only be used in a server.')],
                ephemeral: true,
            });
        }

        if (command.permissions && !interaction.memberPermissions?.has(command.permissions)) {
            return interaction.reply({
                embeds:    [EmbedHelper.error('Permission Denied', "You don't have the required permissions.")],
                ephemeral: true,
            });
        }

        try {
            command.executeSlash(interaction);
        } catch (error) {
            console.error('[Slash Error]', error);
            const opts = { embeds: [EmbedHelper.error('Error', 'Something went wrong.')], ephemeral: true };
            if (interaction.replied || interaction.deferred) interaction.followUp(opts);
            else interaction.reply(opts);
        }
    }
}

module.exports = InteractionCreateEvent;
