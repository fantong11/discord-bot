const ytdl = require('ytdl-core');
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    StreamType,
    NoSubscriberBehavior,
} = require('@discordjs/voice');
const IAudioPlayer  = require('../../../application/ports/IAudioPlayer');
const EmbedHelper   = require('../../../shared/helpers/EmbedHelper');
const FormatHelper  = require('../../../shared/helpers/FormatHelper');

// Infrastructure adapter: bridges @discordjs/voice + ytdl-core with the IAudioPlayer port.
class DiscordVoiceAudioPlayer extends IAudioPlayer {
    constructor(discordClient, queueRepository) {
        super();
        this.client          = discordClient;
        this.queueRepository = queueRepository;
        this._connections = new Map(); // guildId → VoiceConnection
        this._players     = new Map(); // guildId → AudioPlayer
        this._resources   = new Map(); // guildId → AudioResource (for inline volume)
    }

    async connect(guildId, voiceChannelId) {
        const guild  = this.client.guilds.cache.get(guildId);
        const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });

        player.on(AudioPlayerStatus.Idle, () => this._onTrackEnd(guildId));
        player.on('error', (err) => {
            console.error('[AudioPlayer] Error:', err.message);
            this._onTrackEnd(guildId);
        });

        const conn = joinVoiceChannel({
            channelId:      voiceChannelId,
            guildId,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf:       true,
        });
        conn.subscribe(player);

        this._connections.set(guildId, conn);
        this._players.set(guildId, player);
    }

    async play(guildId, track, volume) {
        const player = this._players.get(guildId);
        if (!player) return;

        const stream = ytdl(track.url, {
            filter:         'audioonly',
            quality:        'highestaudio',
            highWaterMark:  1 << 25,
        });

        const resource = createAudioResource(stream, {
            inputType:    StreamType.Arbitrary,
            inlineVolume: true,
        });
        resource.volume.setVolume(volume);
        this._resources.set(guildId, resource);
        player.play(resource);
    }

    async stop(guildId) {
        const queue = await this.queueRepository.get(guildId);
        if (queue) {
            queue.songs = [];
            await this.queueRepository.save(guildId, queue);
        }
        this._players.get(guildId)?.stop();
    }

    async pause(guildId)  { this._players.get(guildId)?.pause(); }
    async resume(guildId) { this._players.get(guildId)?.unpause(); }

    async setVolume(guildId, volume) {
        this._resources.get(guildId)?.volume?.setVolume(volume);
    }

    // Stopping the player triggers the Idle event which advances the queue naturally.
    async skip(guildId) { this._players.get(guildId)?.stop(); }

    // ── Private ────────────────────────────────────────────────────────────────

    _disconnect(guildId) {
        this._connections.get(guildId)?.destroy();
        this._connections.delete(guildId);
        this._players.delete(guildId);
        this._resources.delete(guildId);
    }

    async _onTrackEnd(guildId) {
        const queue = await this.queueRepository.get(guildId);
        if (!queue) return;

        const nextTrack = queue.advance();
        await this.queueRepository.save(guildId, queue);

        if (nextTrack) {
            await this.play(guildId, nextTrack, queue.volume);
            this._notifyNowPlaying(queue, nextTrack);
        } else {
            this._disconnect(guildId);
            await this.queueRepository.delete(guildId);
            this._notifyQueueFinished(queue);
        }
    }

    _notifyNowPlaying(queue, track) {
        const channel = this.client.channels.cache.get(queue.textChannelId);
        if (!channel) return;
        const embed = EmbedHelper.music('Now Playing', `**[${track.name}](${track.url})**`)
            .addFields(
                { name: 'Duration', value: FormatHelper.duration(track.durationSeconds), inline: true },
                { name: 'Volume',   value: FormatHelper.volumeBar(queue.volume),         inline: true },
                { name: 'Loop',     value: queue.loop ? '🔁 On' : '➡️ Off',             inline: true },
            );
        if (track.thumbnailUrl) embed.setThumbnail(track.thumbnailUrl);
        channel.send({ embeds: [embed] }).catch(console.error);
    }

    _notifyQueueFinished(queue) {
        const channel = this.client.channels.cache.get(queue.textChannelId);
        if (!channel) return;
        channel.send({
            embeds: [EmbedHelper.info('Queue Finished', 'No more songs in the queue. See you next time! 👋')],
        }).catch(console.error);
    }
}

module.exports = DiscordVoiceAudioPlayer;
