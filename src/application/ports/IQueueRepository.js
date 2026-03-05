// Port: persistence contract for guild queues.
class IQueueRepository {
    async get(guildId)         { throw new Error('Not implemented'); }
    async save(guildId, queue) { throw new Error('Not implemented'); }
    async delete(guildId)      { throw new Error('Not implemented'); }
}

module.exports = IQueueRepository;
