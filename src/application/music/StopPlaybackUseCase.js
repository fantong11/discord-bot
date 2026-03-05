class StopPlaybackUseCase {
    constructor(queueRepository, audioPlayer) {
        this.queueRepository = queueRepository;
        this.audioPlayer = audioPlayer;
    }

    async execute({ guildId }) {
        const queue = await this.queueRepository.get(guildId);
        if (!queue) return { status: 'nothing_playing' };
        await this.audioPlayer.stop(guildId);
        return { status: 'stopped' };
    }
}

module.exports = StopPlaybackUseCase;
