class SetVolumeUseCase {
    constructor(queueRepository, audioPlayer) {
        this.queueRepository = queueRepository;
        this.audioPlayer = audioPlayer;
    }

    async execute({ guildId, volume }) {
        if (isNaN(volume) || volume < 0 || volume > 100) {
            return { status: 'invalid_volume' };
        }
        const queue = await this.queueRepository.get(guildId);
        if (!queue?.currentTrack) return { status: 'nothing_playing' };

        const normalized = volume / 100;
        queue.volume = normalized;
        await this.audioPlayer.setVolume(guildId, normalized);
        await this.queueRepository.save(guildId, queue);
        return { status: 'set', normalizedVolume: normalized };
    }
}

module.exports = SetVolumeUseCase;
