const ytdl = require("ytdl-core");
const {
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    StreamType,
    NoSubscriberBehavior,
} = require("@discordjs/voice");
const EmbedHelper = require("./EmbedHelper");
const FormatHelper = require("./FormatHelper");

class MusicPlayer {
    static createPlayer(guildQueue, message) {
        const player = createAudioPlayer({
            behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
        });

        player.on(AudioPlayerStatus.Idle, () => {
            if (!guildQueue.loop) {
                guildQueue.songs.shift();
            }
            if (guildQueue.songs.length) {
                MusicPlayer.playSong(guildQueue, message);
            } else {
                guildQueue.voiceConnection.destroy();
                message.client.queue.delete(message.guild.id);
                guildQueue.textChannel.send({
                    embeds: [EmbedHelper.info("Queue Finished", "No more songs in the queue. See you next time! 👋")],
                });
            }
        });

        player.on("error", (error) => {
            console.error("AudioPlayer error:", error);
            guildQueue.songs.shift();
            if (guildQueue.songs.length) {
                MusicPlayer.playSong(guildQueue, message);
            }
        });

        return player;
    }

    static playSong(guildQueue, message) {
        const song = guildQueue.songs[0];

        const stream = ytdl(song.getUrl(), {
            filter: "audioonly",
            quality: "highestaudio",
            highWaterMark: 1 << 25,
        });

        const resource = createAudioResource(stream, {
            inputType: StreamType.Arbitrary,
            inlineVolume: true,
        });

        resource.volume.setVolume(guildQueue.volume);
        guildQueue.currentResource = resource;
        guildQueue.audioPlayer.play(resource);
        guildQueue.playing = true;

        const embed = EmbedHelper.music(
            "Now Playing",
            `**[${song.getName()}](${song.getUrl()})**`
        ).addFields(
            { name: "Duration", value: FormatHelper.duration(song.getTime()), inline: true },
            { name: "Volume",   value: FormatHelper.volumeBar(guildQueue.volume), inline: true },
            { name: "Loop",     value: guildQueue.loop ? "🔁 On" : "➡️ Off", inline: true }
        );

        if (song.getThumbnail()) {
            embed.setThumbnail(song.getThumbnail());
        }

        guildQueue.textChannel.send({ embeds: [embed] });
    }
}

module.exports = MusicPlayer;
