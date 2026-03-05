const { SlashCommandBuilder } = require('discord.js');
const Command       = require('../base/Command');
const EmbedHelper   = require('../../../../shared/helpers/EmbedHelper');
const FormatHelper  = require('../../../../shared/helpers/FormatHelper');

class Play extends Command {
    constructor(client) {
        super('play', 'Play a YouTube video in your voice channel.', client);
        this.argsIsRequired = true;
        this.aliases        = ['p'];
        this.guildOnly      = true;
        this.usage          = '<YouTube URL>';
        this.cooldown       = 5;
        this.category       = '🎵 Music';
    }

    get data() {
        return new SlashCommandBuilder()
            .setName('play')
            .setDescription(this.description)
            .addStringOption((opt) =>
                opt.setName('url').setDescription('YouTube URL').setRequired(true),
            );
    }

    async _play(url, voiceChannel, channel, guild, reply, editReply) {
        const loadMsg = await reply({ embeds: [EmbedHelper.info('Searching…', `Looking up \`${url}\``)] });

        let result;
        try {
            result = await this.useCases.playTrack.execute({
                guildId:       guild.id,
                voiceChannelId: voiceChannel.id,
                textChannelId:  channel.id,
                url,
            });
        } catch (error) {
            return editReply(loadMsg, { embeds: [EmbedHelper.error('Not Found', error.message)] });
        }

        if (result.status === 'playing') {
            // DiscordVoiceAudioPlayer sends the "Now Playing" embed automatically.
            if (loadMsg?.delete) loadMsg.delete().catch(() => {});
            else editReply(loadMsg, { content: '▶️ Starting playback…', embeds: [] });
        } else {
            const { track, position } = result;
            const embed = EmbedHelper.success('Added to Queue', `**[${track.name}](${track.url})**`)
                .addFields(
                    { name: 'Duration',          value: FormatHelper.duration(track.durationSeconds), inline: true },
                    { name: 'Position in Queue', value: `#${position}`,                               inline: true },
                );
            if (track.thumbnailUrl) embed.setThumbnail(track.thumbnailUrl);
            editReply(loadMsg, { embeds: [embed] });
        }
    }

    async execute() {
        const voiceChannel = this.message.member.voice.channel;
        if (!voiceChannel) return EmbedHelper.sendError(this.message.channel, 'Not in Voice Channel', 'You need to join a voice channel first!');
        this.message.channel.sendTyping().catch(() => {});
        await this._play(
            this.args[0],
            voiceChannel,
            this.message.channel,
            this.message.guild,
            (opts) => this.message.channel.send(opts),
            (msg, opts) => msg.edit(opts),
        );
    }

    async executeSlash(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) return interaction.reply({ embeds: [EmbedHelper.error('Not in Voice Channel', 'You need to join a voice channel first!')], ephemeral: true });
        await interaction.deferReply();
        await this._play(
            interaction.options.getString('url'),
            voiceChannel,
            interaction.channel,
            interaction.guild,
            (opts) => interaction.editReply(opts),
            (_, opts) => interaction.editReply(opts),
        );
    }
}

module.exports = Play;
