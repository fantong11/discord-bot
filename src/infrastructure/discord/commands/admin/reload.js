const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Command = require('../base/Command');
const EmbedHelper = require('../../../../shared/helpers/EmbedHelper');

class Reload extends Command {
    constructor(client) {
        super('reload', 'Reload a command from disk.', client);
        this.argsIsRequired = true;
        this.aliases = ['r'];
        this.usage = '[Command name]';
        this.category = '⚙️ Admin';
        this.permissions = PermissionFlagsBits.Administrator; // Only admins should reload commands
    }

    get data() {
        return new SlashCommandBuilder()
            .setName('reload')
            .setDescription(this.description)
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addStringOption((opt) =>
                opt.setName('command').setDescription('Command name to reload.').setRequired(true)
            );
    }

    _runReload(commandName) {
        try {
            const result = this.useCases.reloadCommand.execute({ commandName });
            return { success: `Command \`${result.commandName}\` was reloaded successfully.` };
        } catch (error) {
            return { error: ['Reload Failed', error.message] };
        }
    }

    execute() {
        const result = this._runReload(this.args[0].toLowerCase());
        if (result.error) {
            return this.message.channel.send({ embeds: [EmbedHelper.error(...result.error)] });
        }
        this.message.channel.send({ embeds: [EmbedHelper.success('Reloaded', result.success)] });
    }

    executeSlash(interaction) {
        const result = this._runReload(interaction.options.getString('command').toLowerCase());
        if (result.error) {
            return interaction.reply({ embeds: [EmbedHelper.error(...result.error)], ephemeral: true });
        }
        interaction.reply({ embeds: [EmbedHelper.success('Reloaded', result.success)] });
    }
}

module.exports = Reload;
