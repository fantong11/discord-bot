const GuildQueue  = require('../../domain/music/GuildQueue');
const Track       = require('../../domain/music/Track');
const DomainError = require('../../domain/shared/DomainError');

class PlayTrackUseCase {
    constructor(queueRepository, trackInfoService, audioPlayer) {
        this.queueRepository = queueRepository;
        this.trackInfoService = trackInfoService;
        this.audioPlayer = audioPlayer;
    }

    async execute({ guildId, voiceChannelId, textChannelId, url }) {
        let trackInfo;
        try {
            trackInfo = await this.trackInfoService.getInfo(url);
        } catch {
            throw new DomainError('Could not fetch video info. Please check the URL.');
        }

        const track = new Track(trackInfo.title, trackInfo.durationSeconds, url, trackInfo.thumbnailUrl);

        let queue = await this.queueRepository.get(guildId);
        const isFirstSong = !queue || queue.isEmpty;

        if (!queue) {
            queue = new GuildQueue(guildId, textChannelId, voiceChannelId);
        }
        queue.addTrack(track);
        await this.queueRepository.save(guildId, queue);

        if (isFirstSong) {
            await this.audioPlayer.connect(guildId, voiceChannelId);
            await this.audioPlayer.play(guildId, track, queue.volume);
            queue.playing = true;
            await this.queueRepository.save(guildId, queue);
            return { status: 'playing', track };
        }

        return { status: 'queued', track, position: queue.size };
    }
}

module.exports = PlayTrackUseCase;
