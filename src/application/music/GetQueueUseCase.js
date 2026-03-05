class GetQueueUseCase {
    constructor(queueRepository) {
        this.queueRepository = queueRepository;
    }

    async execute({ guildId }) {
        const queue = await this.queueRepository.get(guildId);
        if (!queue || queue.isEmpty) return { status: 'empty' };
        return { status: 'ok', queue };
    }
}

module.exports = GetQueueUseCase;
