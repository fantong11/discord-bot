const { SlashCommandBuilder } = require('discord.js');
const Command      = require('../base/Command');
const EmbedHelper  = require('../../../../shared/helpers/EmbedHelper');
const FormatHelper = require('../../../../shared/helpers/FormatHelper');

class NowPlaying extends Command {
    constructor(client) {
        super('nowplaying', 'Show the currently playing song.', client);
        this.guildOnly = true;
        this.aliases   = ['np'];
        this.category  = '🎵 Music';
    }

    get data() {
        return new SlashCommandBuilder().setName('nowplaying').setDescription(this.description);
    }

    async _buildEmbed(guildId) {
        const result = await this.useCases.getNowPlaying.execute({ guildId });
        if (result.status !== 'ok') return null;
        const { track, queue } = result;
        const embed = EmbedHelper.music('Now Playing', `**[${track.name}](${track.url})**`)
            .addFields(
                { name: 'Duration', value: FormatHelper.duration(track.durationSeconds),      inline: true },
                { name: 'Volume',   value: FormatHelper.volumeBar(queue.volume),              inline: true },
                { name: 'Loop',     value: queue.loop ? '🔁 On' : '➡️ Off',                  inline: true },
                { name: 'Status',   value: queue.playing ? '▶️ Playing' : '⏸️ Paused',       inline: true },
                { name: 'Queue',    value: `${queue.size} song(s)`,                           inline: true },
            );
        if (track.thumbnailUrl) embed.setThumbnail(track.thumbnailUrl);
        return embed;
    }

    async execute() {
        const embed = await this._buildEmbed(this.message.guild.id);
        if (!embed) return EmbedHelper.sendError(this.message.channel, 'Nothing Playing', 'There is nothing playing right now.');
        this.message.channel.send({ embeds: [embed] });
    }

    async executeSlash(interaction) {
        const embed = await this._buildEmbed(interaction.guild.id);
        if (!embed) return interaction.reply({ embeds: [EmbedHelper.error('Nothing Playing', 'There is nothing playing right now.')], ephemeral: true });
        interaction.reply({ embeds: [embed] });
    }
}

module.exports = NowPlaying;
