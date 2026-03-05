const { SlashCommandBuilder } = require('discord.js');
const Command     = require('../base/Command');
const EmbedHelper = require('../../../../shared/helpers/EmbedHelper');

class Stop extends Command {
    constructor(client) {
        super('stop', 'Stop music and disconnect from the voice channel.', client);
        this.guildOnly = true;
        this.aliases   = ['leave', 'disconnect'];
        this.category  = '🎵 Music';
    }

    get data() {
        return new SlashCommandBuilder().setName('stop').setDescription(this.description);
    }

    async _run(voiceChannel, guildId) {
        if (!voiceChannel) return { error: ['Not in Voice Channel', 'You need to be in a voice channel to stop music!'] };
        const result = await this.useCases.stopPlayback.execute({ guildId });
        if (result.status === 'nothing_playing') return { error: ['Nothing Playing', 'There is no music playing right now.'] };
        return { success: ['Stopped', 'Music stopped and disconnected from voice channel. 👋'] };
    }

    async execute() {
        const result = await this._run(this.message.member.voice.channel, this.message.guild.id);
        if (result.error) return EmbedHelper.sendError(this.message.channel, ...result.error);
        this.message.channel.send({ embeds: [EmbedHelper.success(...result.success)] });
    }

    async executeSlash(interaction) {
        const result = await this._run(interaction.member.voice.channel, interaction.guild.id);
        if (result.error) return interaction.reply({ embeds: [EmbedHelper.error(...result.error)], ephemeral: true });
        interaction.reply({ embeds: [EmbedHelper.success(...result.success)] });
    }
}

module.exports = Stop;
