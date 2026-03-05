const { SlashCommandBuilder } = require('discord.js');
const Command     = require('../base/Command');
const EmbedHelper = require('../../../../shared/helpers/EmbedHelper');

class Loop extends Command {
    constructor(client) {
        super('loop', 'Toggle loop for the current song.', client);
        this.guildOnly = true;
        this.category  = '🎵 Music';
    }

    get data() {
        return new SlashCommandBuilder().setName('loop').setDescription(this.description);
    }

    async _run(guildId) {
        const result = await this.useCases.toggleLoop.execute({ guildId });
        if (result.status === 'nothing_playing') return { error: ['Nothing Playing', 'There is nothing playing right now.'] };
        return { loop: result.loop };
    }

    async execute() {
        const result = await this._run(this.message.guild.id);
        if (result.error) return EmbedHelper.sendError(this.message.channel, ...result.error);
        this.message.channel.send({
            embeds: [result.loop
                ? EmbedHelper.success('Loop Enabled', '🔁 The current song will repeat.')
                : EmbedHelper.info('Loop Disabled', '➡️ Playing through the queue.')],
        });
    }

    async executeSlash(interaction) {
        const result = await this._run(interaction.guild.id);
        if (result.error) return interaction.reply({ embeds: [EmbedHelper.error(...result.error)], ephemeral: true });
        interaction.reply({
            embeds: [result.loop
                ? EmbedHelper.success('Loop Enabled', '🔁 The current song will repeat.')
                : EmbedHelper.info('Loop Disabled', '➡️ Playing through the queue.')],
        });
    }
}

module.exports = Loop;
