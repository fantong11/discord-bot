const { SlashCommandBuilder } = require('discord.js');
const Command     = require('../base/Command');
const EmbedHelper = require('../../../../shared/helpers/EmbedHelper');

class Skip extends Command {
    constructor(client) {
        super('skip', 'Skip the current song.', client);
        this.guildOnly = true;
        this.aliases   = ['s'];
        this.category  = '🎵 Music';
    }

    get data() {
        return new SlashCommandBuilder().setName('skip').setDescription(this.description);
    }

    async _run(voiceChannel, guildId) {
        if (!voiceChannel) return { error: ['Not in Voice Channel', 'You need to be in a voice channel to skip!'] };
        const result = await this.useCases.skipTrack.execute({ guildId });
        if (result.status === 'nothing_playing') return { error: ['Nothing to Skip', 'There is nothing playing right now.'] };
        return { success: ['Skipped', `Skipped **${result.trackName}**.`] };
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

module.exports = Skip;
