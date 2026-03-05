class ToggleLoopUseCase {
    constructor(queueRepository) {
        this.queueRepository = queueRepository;
    }

    async execute({ guildId }) {
        const queue = await this.queueRepository.get(guildId);
        if (!queue) return { status: 'nothing_playing' };
        queue.loop = !queue.loop;
        await this.queueRepository.save(guildId, queue);
        return { status: 'toggled', loop: queue.loop };
    }
}

module.exports = ToggleLoopUseCase;
