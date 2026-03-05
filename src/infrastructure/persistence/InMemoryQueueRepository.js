const IQueueRepository = require('../../application/ports/IQueueRepository');

class InMemoryQueueRepository extends IQueueRepository {
    constructor() {
        super();
        this._store = new Map();
    }

    async get(guildId)         { return this._store.get(guildId) || null; }
    async save(guildId, queue) { this._store.set(guildId, queue); }
    async delete(guildId)      { this._store.delete(guildId); }
}

module.exports = InMemoryQueueRepository;
