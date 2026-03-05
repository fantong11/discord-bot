class GetNowPlayingUseCase {
    constructor(queueRepository) {
        this.queueRepository = queueRepository;
    }

    async execute({ guildId }) {
        const queue = await this.queueRepository.get(guildId);
        if (!queue || queue.isEmpty) return { status: 'nothing_playing' };
        return { status: 'ok', track: queue.currentTrack, queue };
    }
}

module.exports = GetNowPlayingUseCase;
