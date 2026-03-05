class PausePlaybackUseCase {
    constructor(queueRepository, audioPlayer) {
        this.queueRepository = queueRepository;
        this.audioPlayer = audioPlayer;
    }

    async execute({ guildId }) {
        const queue = await this.queueRepository.get(guildId);
        if (!queue || !queue.playing) return { status: 'not_playing' };
        await this.audioPlayer.pause(guildId);
        queue.playing = false;
        await this.queueRepository.save(guildId, queue);
        return { status: 'paused' };
    }
}

module.exports = PausePlaybackUseCase;
