const { SlashCommandBuilder } = require('discord.js');
const Command     = require('../base/Command');
const EmbedHelper = require('../../../../shared/helpers/EmbedHelper');

class Pause extends Command {
    constructor(client) {
        super('pause', 'Pause the current song.', client);
        this.guildOnly = true;
        this.category  = '🎵 Music';
    }

    get data() {
        return new SlashCommandBuilder().setName('pause').setDescription(this.description);
    }

    async _run(guildId) {
        const result = await this.useCases.pausePlayback.execute({ guildId });
        if (result.status === 'not_playing') return { error: ['Nothing Playing', 'There is nothing to pause.'] };
        return { success: ['Paused', 'Use `/resume` to continue.'] };
    }

    async execute() {
        const result = await this._run(this.message.guild.id);
        if (result.error) return EmbedHelper.sendError(this.message.channel, ...result.error);
        this.message.channel.send({ embeds: [EmbedHelper.success(...result.success)] });
    }

    async executeSlash(interaction) {
        const result = await this._run(interaction.guild.id);
        if (result.error) return interaction.reply({ embeds: [EmbedHelper.error(...result.error)], ephemeral: true });
        interaction.reply({ embeds: [EmbedHelper.success(...result.success)] });
    }
}

module.exports = Pause;
