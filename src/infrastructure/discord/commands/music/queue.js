const { SlashCommandBuilder } = require('discord.js');
const Command      = require('../base/Command');
const EmbedHelper  = require('../../../../shared/helpers/EmbedHelper');
const FormatHelper = require('../../../../shared/helpers/FormatHelper');

const PAGE_SIZE = 10;

class Queue extends Command {
    constructor(client) {
        super('queue', 'Show the current music queue.', client);
        this.guildOnly = true;
        this.aliases   = ['q'];
        this.usage     = '[page]';
        this.category  = '🎵 Music';
    }

    get data() {
        return new SlashCommandBuilder()
            .setName('queue')
            .setDescription(this.description)
            .addIntegerOption((opt) =>
                opt.setName('page').setDescription('Page number.').setMinValue(1),
            );
    }

    async _buildEmbed(guildId, page) {
        const result = await this.useCases.getQueue.execute({ guildId });
        if (result.status !== 'ok') return null;
        const { queue } = result;

        const total      = queue.size;
        const totalPages = Math.ceil(total / PAGE_SIZE);
        const clamped    = Math.min(Math.max(1, page), totalPages);
        const start      = (clamped - 1) * PAGE_SIZE;

        const lines = queue.songs.slice(start, start + PAGE_SIZE).map((track, i) => {
            const index = start + i;
            return `${index === 0 ? '▶' : `${index}.`}  **${track.name}**  \`${FormatHelper.duration(track.durationSeconds)}\``;
        });

        return EmbedHelper.music(`Queue  •  ${total} song(s)`, lines.join('\n'))
            .setFooter({ text: `Page ${clamped}/${totalPages}  •  DiscordBot` });
    }

    async execute() {
        const embed = await this._buildEmbed(this.message.guild.id, parseInt(this.args[0], 10) || 1);
        if (!embed) return EmbedHelper.sendError(this.message.channel, 'Queue Empty', 'There are no songs in the queue.');
        this.message.channel.send({ embeds: [embed] });
    }

    async executeSlash(interaction) {
        const embed = await this._buildEmbed(interaction.guild.id, interaction.options.getInteger('page') || 1);
        if (!embed) return interaction.reply({ embeds: [EmbedHelper.error('Queue Empty', 'There are no songs in the queue.')], ephemeral: true });
        interaction.reply({ embeds: [embed] });
    }
}

module.exports = Queue;
