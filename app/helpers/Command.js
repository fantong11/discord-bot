// Template Method pattern: defines the skeleton of command execution.
// Subclasses implement execute() (prefix) and optionally executeSlash() (slash).
class Command {
    constructor(name, description) {
        if (this.constructor === Command) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.name = name;
        this.description = description;
    }

    // --- Prefix command support ---

    setMessageAndArgs(message, args) {
        this.message = message;
        this.args = args;
    }

    execute() {
        throw new Error("Method execute() must be implemented.");
    }

    undo() {}

    // --- Slash command support ---

    // Return a SlashCommandBuilder instance. null = not available as slash command.
    get data() {
        return null;
    }

    executeSlash(interaction) {
        interaction.reply({ content: "This command is not available as a slash command.", ephemeral: true });
    }
}

module.exports = Command;
