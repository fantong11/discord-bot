// Abstract base for all Discord commands (Template Method pattern).
// Each command receives the Discord client on construction so it can access
// client.useCases (injected by the composition root).
class Command {
    constructor(name, description, client) {
        if (this.constructor === Command) {
            throw new Error('Abstract class cannot be instantiated directly.');
        }
        this.name        = name;
        this.description = description;
        this.client      = client;
    }

    get useCases() { return this.client?.useCases; }

    setMessageAndArgs(message, args) {
        this.message = message;
        this.args    = args;
    }

    execute()  { throw new Error('Method execute() must be implemented.'); }
    undo()     {}

    get data() { return null; }

    executeSlash(interaction) {
        interaction.reply({ content: 'This command is not available as a slash command.', ephemeral: true });
    }
}

module.exports = Command;
