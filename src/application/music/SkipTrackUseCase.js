class SkipTrackUseCase {
    constructor(queueRepository, audioPlayer) {
        this.queueRepository = queueRepository;
        this.audioPlayer = audioPlayer;
    }

    async execute({ guildId }) {
        const queue = await this.queueRepository.get(guildId);
        if (!queue || queue.isEmpty) return { status: 'nothing_playing' };
        const trackName = queue.currentTrack.name;
        await this.audioPlayer.skip(guildId);
        return { status: 'skipped', trackName };
    }
}

module.exports = SkipTrackUseCase;
