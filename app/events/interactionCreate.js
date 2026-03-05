const IEvent = require("../helpers/IEvent");
const EmbedHelper = require("../helpers/EmbedHelper");

class InteractionCreate extends IEvent {
    constructor() {
        super("interactionCreate", false);
    }

    execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const CommandClass = interaction.client.commands.get(interaction.commandName);
        if (!CommandClass) return;

        const command = new CommandClass();

        // Guild-only check
        if (command.guildOnly && !interaction.guild) {
            return interaction.reply({
                embeds: [EmbedHelper.error("Server Only", "This command can only be used in a server.")],
                ephemeral: true,
            });
        }

        // Permission check
        if (command.permissions && !interaction.memberPermissions?.has(command.permissions)) {
            return interaction.reply({
                embeds: [EmbedHelper.error("Permission Denied", "You don't have the required permissions.")],
                ephemeral: true,
            });
        }

        try {
            command.executeSlash(interaction);
        } catch (error) {
            console.error(error);
            const errEmbed = { embeds: [EmbedHelper.error("Error", "Something went wrong while executing that command.")], ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                interaction.followUp(errEmbed);
            } else {
                interaction.reply(errEmbed);
            }
        }
    }
}

module.exports = InteractionCreate;
