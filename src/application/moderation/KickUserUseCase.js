const DomainError = require('../../domain/shared/DomainError');

class KickUserUseCase {
    constructor(guildMemberService) {
        this.guildMemberService = guildMemberService;
    }

    async execute({ guildId, targetUserId, requestorId }) {
        if (targetUserId === requestorId) {
            throw new DomainError("You cannot kick yourself.");
        }

        const isKickable = await this.guildMemberService.isKickable(guildId, targetUserId);
        if (!isKickable) {
            throw new DomainError("I don't have permission to kick this user.");
        }

        const user = await this.guildMemberService.kickUser(guildId, targetUserId);
        return { success: true, user };
    }
}

module.exports = KickUserUseCase;
