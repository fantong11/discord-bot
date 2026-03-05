const { SlashCommandBuilder } = require("discord.js");
const Command = require("../helpers/Command");
const EmbedHelper = require("../helpers/EmbedHelper");

class Loop extends Command {
    constructor() {
        super("loop", "Toggle loop for the current song.");
        this.guildOnly = true;
        this.category = "🎵 Music";
    }

    get data() {
        return new SlashCommandBuilder().setName("loop").setDescription(this.description);
    }

    _run(queue) {
        if (!queue) return { error: ["Nothing Playing", "There is nothing playing right now."] };
        queue.loop = !queue.loop;
        return { loop: queue.loop };
    }

    execute() {
        const result = this._run(this.message.client.queue.get(this.message.guild.id));
        if (result.error) return EmbedHelper.sendError(this.message.channel, ...result.error);
        this.message.channel.send({
            embeds: [result.loop ? EmbedHelper.success("Loop Enabled", "🔁 The current song will repeat.") : EmbedHelper.info("Loop Disabled", "➡️ Playing through the queue.")],
        });
    }

    executeSlash(interaction) {
        const result = this._run(interaction.client.queue.get(interaction.guild.id));
        if (result.error) return interaction.reply({ embeds: [EmbedHelper.error(...result.error)], ephemeral: true });
        interaction.reply({
            embeds: [result.loop ? EmbedHelper.success("Loop Enabled", "🔁 The current song will repeat.") : EmbedHelper.info("Loop Disabled", "➡️ Playing through the queue.")],
        });
    }
}

module.exports = Loop;
