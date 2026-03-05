const { SlashCommandBuilder } = require("discord.js");
const Command = require("../helpers/Command");
const CommandResolver = require("../helpers/CommandResolver");
const EmbedHelper = require("../helpers/EmbedHelper");

class Reload extends Command {
    constructor() {
        super("reload", "Reload a command from disk.");
        this.argsIsRequired = true;
        this.aliases = ["r"];
        this.usage = "[Command name]";
        this.category = "⚙️ Admin";
        this.commandResolver = new CommandResolver();
    }

    get data() {
        return new SlashCommandBuilder()
            .setName("reload")
            .setDescription(this.description)
            .addStringOption((opt) =>
                opt.setName("command").setDescription("Command name to reload.").setRequired(true)
            );
    }

    _run(commands, commandName) {
        const CommandClass = this.commandResolver.resolve(commands, commandName);
        if (!CommandClass) return { error: ["Not Found", `No command found with name or alias \`${commandName}\`.`] };

        const command = new CommandClass();
        delete require.cache[require.resolve(`./${command.name}.js`)];

        try {
            const newCommand = require(`./${command.name}.js`);
            commands.set(command.name, newCommand);
            return { success: `Command \`${command.name}\` was reloaded successfully.` };
        } catch (error) {
            console.error(error);
            return { error: ["Reload Failed", `Could not reload \`${command.name}\`:\n\`\`\`${error.message}\`\`\``] };
        }
    }

    execute() {
        const result = this._run(this.message.client.commands, this.args[0].toLowerCase());
        if (result.error)   return this.message.channel.send({ embeds: [EmbedHelper.error(...result.error)] });
        this.message.channel.send({ embeds: [EmbedHelper.success("Reloaded", result.success)] });
    }

    executeSlash(interaction) {
        const result = this._run(interaction.client.commands, interaction.options.getString("command").toLowerCase());
        if (result.error)   return interaction.reply({ embeds: [EmbedHelper.error(...result.error)], ephemeral: true });
        interaction.reply({ embeds: [EmbedHelper.success("Reloaded", result.success)] });
    }
}

module.exports = Reload;
