const { SlashCommandBuilder } = require('discord.js');
const Command     = require('../base/Command');
const EmbedHelper = require('../../../../shared/helpers/EmbedHelper');

class Resume extends Command {
    constructor(client) {
        super('resume', 'Resume the paused song.', client);
        this.guildOnly = true;
        this.category  = '🎵 Music';
    }

    get data() {
        return new SlashCommandBuilder().setName('resume').setDescription(this.description);
    }

    async _run(guildId) {
        const result = await this.useCases.resumePlayback.execute({ guildId });
        if (result.status === 'nothing_playing')  return { error: ['Nothing Playing', 'There is nothing to resume.'] };
        if (result.status === 'already_playing')  return { error: ['Already Playing', 'Music is already playing.'] };
        return { success: ['Resumed', '▶️ Resuming playback.'] };
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

module.exports = Resume;
