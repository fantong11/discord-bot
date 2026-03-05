const CommandResolver = require('../../../shared/helpers/CommandResolver');

class DiscordCommandAdapter {
    constructor(client) {
        this.client = client;
        this.commandResolver = new CommandResolver();
    }

    reloadCommand(commandName) {
        const commands = this.client.commands;
        const CommandClass = this.commandResolver.resolve(commands, commandName);

        if (!CommandClass) {
            throw new Error(`No command found with name or alias \`${commandName}\`.`);
        }

        const command = new CommandClass(this.client);
        const commandFile = command.name + '.js';

        // Find the absolute path for clearing cache. We need to search registered command paths.
        // Assuming commands are registered from their respective category folders.
        const fs = require('fs');
        const path = require('path');
        const root = path.join(__dirname, '../../commands');

        let targetFilePath = null;
        for (const category of ['general', 'music', 'moderation', 'admin']) {
            const dir = path.join(root, category);
            if (!fs.existsSync(dir)) continue;

            const potentialPath = path.join(dir, commandFile);
            if (fs.existsSync(potentialPath)) {
                targetFilePath = potentialPath;
                break;
            }
        }

        if (!targetFilePath) {
            throw new Error(`Could not locate command file for \`${command.name}\`.`);
        }

        delete require.cache[require.resolve(targetFilePath)];
        const newCommand = require(targetFilePath);
        commands.set(command.name, newCommand);

        return command.name;
    }
}

module.exports = DiscordCommandAdapter;
