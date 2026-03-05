const { SlashCommandBuilder } = require("discord.js");
const ytdl = require("ytdl-core");
const { joinVoiceChannel } = require("@discordjs/voice");
const Command = require("../helpers/Command");
const Music = require("../helpers/Music");
const MusicPlayer = require("../helpers/MusicPlayer");
const EmbedHelper = require("../helpers/EmbedHelper");
const FormatHelper = require("../helpers/FormatHelper");

class Play extends Command {
    constructor() {
        super("play", "Play a YouTube video in your voice channel.");
        this.argsIsRequired = true;
        this.aliases = ["p"];
        this.guildOnly = true;
        this.usage = "<YouTube URL>";
        this.cooldown = 5;
        this.category = "🎵 Music";
    }

    get data() {
        return new SlashCommandBuilder()
            .setName("play")
            .setDescription(this.description)
            .addStringOption((opt) =>
                opt.setName("url").setDescription("YouTube URL").setRequired(true)
            );
    }

    async _play(url, voiceChannel, queue, channel, client, guild, reply, editReply) {
        const loadEmbed = EmbedHelper.info("Searching…", `Looking up \`${url}\``);
        const loadMsg = await reply({ embeds: [loadEmbed] });

        let songInfo;
        try {
            songInfo = await ytdl.getInfo(url);
        } catch (error) {
            console.error(error);
            return editReply(loadMsg, { embeds: [EmbedHelper.error("Not Found", "Could not fetch video info. Please check the URL.")] });
        }

        const { title, lengthSeconds, thumbnails } = songInfo.videoDetails;
        const thumbnail = thumbnails?.[thumbnails.length - 1]?.url || null;
        const song = new Music(title, lengthSeconds, url, thumbnail);
        const serverQueue = client.queue.get(guild.id);

        if (!serverQueue) {
            const queueConstruct = {
                textChannel: channel,
                voiceChannel,
                voiceConnection: null,
                audioPlayer: null,
                currentResource: null,
                songs: [song],
                loop: false,
                volume: 0.3,
                playing: true,
            };
            client.queue.set(guild.id, queueConstruct);
            queueConstruct.audioPlayer = MusicPlayer.createPlayer(queueConstruct, { client, guild, channel });
            queueConstruct.voiceConnection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
                selfDeaf: true,
            });
            queueConstruct.voiceConnection.subscribe(queueConstruct.audioPlayer);

            if (loadMsg?.delete) loadMsg.delete().catch(() => {});
            else editReply(loadMsg, { content: "▶️ Starting playback…", embeds: [] });

            MusicPlayer.playSong(queueConstruct, { client, guild, channel });
        } else {
            serverQueue.songs.push(song);
            const embed = EmbedHelper.success("Added to Queue", `**[${song.getName()}](${song.getUrl()})**`)
                .addFields(
                    { name: "Duration",          value: FormatHelper.duration(song.getTime()), inline: true },
                    { name: "Position in Queue", value: `#${serverQueue.songs.length}`,       inline: true }
                );
            if (thumbnail) embed.setThumbnail(thumbnail);
            editReply(loadMsg, { embeds: [embed] });
        }
    }

    async execute() {
        const voiceChannel = this.message.member.voice.channel;
        if (!voiceChannel) return EmbedHelper.sendError(this.message.channel, "Not in Voice Channel", "You need to join a voice channel first!");

        this.message.channel.sendTyping().catch(() => {});
        await this._play(
            this.args[0],
            voiceChannel,
            null,
            this.message.channel,
            this.message.client,
            this.message.guild,
            (opts) => this.message.channel.send(opts),
            (msg, opts) => msg.edit(opts)
        );
    }

    async executeSlash(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) return interaction.reply({ embeds: [EmbedHelper.error("Not in Voice Channel", "You need to join a voice channel first!")], ephemeral: true });

        await interaction.deferReply(); // shows "Bot is thinking…"
        await this._play(
            interaction.options.getString("url"),
            voiceChannel,
            null,
            interaction.channel,
            interaction.client,
            interaction.guild,
            (opts) => interaction.editReply(opts),
            (_, opts) => interaction.editReply(opts)
        );
    }
}

module.exports = Play;
