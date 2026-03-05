class ResumePlaybackUseCase {
    constructor(queueRepository, audioPlayer) {
        this.queueRepository = queueRepository;
        this.audioPlayer = audioPlayer;
    }

    async execute({ guildId }) {
        const queue = await this.queueRepository.get(guildId);
        if (!queue) return { status: 'nothing_playing' };
        if (queue.playing) return { status: 'already_playing' };
        await this.audioPlayer.resume(guildId);
        queue.playing = true;
        await this.queueRepository.save(guildId, queue);
        return { status: 'resumed' };
    }
}

module.exports = ResumePlaybackUseCase;
