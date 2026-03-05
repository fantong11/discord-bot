const DomainError = require('../../domain/shared/DomainError');

class ReloadCommandUseCase {
    constructor(commandService) {
        this.commandService = commandService;
    }

    execute({ commandName }) {
        try {
            const reloadedName = this.commandService.reloadCommand(commandName);
            return { success: true, commandName: reloadedName };
        } catch (error) {
            throw new DomainError(`Could not reload \`${commandName}\`: ${error.message}`);
        }
    }
}

module.exports = ReloadCommandUseCase;
