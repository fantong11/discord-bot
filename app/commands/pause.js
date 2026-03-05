const { SlashCommandBuilder } = require("discord.js");
const Command = require("../helpers/Command");
const EmbedHelper = require("../helpers/EmbedHelper");
const { prefix } = require("../../config");

class Pause extends Command {
    constructor() {
        super("pause", "Pause the current song.");
        this.guildOnly = true;
        this.category = "🎵 Music";
    }

    get data() {
        return new SlashCommandBuilder().setName("pause").setDescription(this.description);
    }

    _run(queue, prefixStr) {
        if (!queue?.audioPlayer)  return { error: ["Nothing Playing", "There is nothing to pause."] };
        if (!queue.playing)       return { error: ["Already Paused",  `Use \`${prefixStr}resume\` to continue playing.`] };
        queue.audioPlayer.pause();
        queue.playing = false;
        return { success: ["Paused", `Use \`${prefixStr}resume\` to continue.`] };
    }

    execute() {
        const result = this._run(this.message.client.queue.get(this.message.guild.id), prefix);
        if (result.error)   return EmbedHelper.sendError(this.message.channel, ...result.error);
        this.message.channel.send({ embeds: [EmbedHelper.success(...result.success)] });
    }

    executeSlash(interaction) {
        const result = this._run(interaction.client.queue.get(interaction.guild.id), "/");
        if (result.error)   return interaction.reply({ embeds: [EmbedHelper.error(...result.error)], ephemeral: true });
        interaction.reply({ embeds: [EmbedHelper.success(...result.success)] });
    }
}

module.exports = Pause;
