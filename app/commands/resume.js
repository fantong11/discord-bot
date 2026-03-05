const { SlashCommandBuilder } = require("discord.js");
const Command = require("../helpers/Command");
const EmbedHelper = require("../helpers/EmbedHelper");

class Resume extends Command {
    constructor() {
        super("resume", "Resume the paused song.");
        this.guildOnly = true;
        this.category = "🎵 Music";
    }

    get data() {
        return new SlashCommandBuilder().setName("resume").setDescription(this.description);
    }

    _run(queue) {
        if (!queue?.audioPlayer) return { error: ["Nothing Playing", "There is nothing to resume."] };
        if (queue.playing)       return { error: ["Already Playing",  "Music is already playing."] };
        queue.audioPlayer.unpause();
        queue.playing = true;
        return { success: ["Resumed", "Music is back on! 🎶"] };
    }

    execute() {
        const result = this._run(this.message.client.queue.get(this.message.guild.id));
        if (result.error)   return EmbedHelper.sendError(this.message.channel, ...result.error);
        this.message.channel.send({ embeds: [EmbedHelper.success(...result.success)] });
    }

    executeSlash(interaction) {
        const result = this._run(interaction.client.queue.get(interaction.guild.id));
        if (result.error)   return interaction.reply({ embeds: [EmbedHelper.error(...result.error)], ephemeral: true });
        interaction.reply({ embeds: [EmbedHelper.success(...result.success)] });
    }
}

module.exports = Resume;
