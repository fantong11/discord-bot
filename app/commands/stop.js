const { SlashCommandBuilder } = require("discord.js");
const Command = require("../helpers/Command");
const EmbedHelper = require("../helpers/EmbedHelper");

class Stop extends Command {
    constructor() {
        super("stop", "Stop music and disconnect from the voice channel.");
        this.guildOnly = true;
        this.aliases = ["leave", "disconnect"];
        this.category = "🎵 Music";
    }

    get data() {
        return new SlashCommandBuilder().setName("stop").setDescription(this.description);
    }

    _run(voiceChannel, queue, channel, guildId, client) {
        if (!voiceChannel) return { error: ["Not in Voice Channel", "You need to be in a voice channel to stop music!"] };
        if (!queue)        return { error: ["Nothing Playing", "There is no music playing right now."] };
        queue.songs = [];
        queue.audioPlayer.stop();
        return { success: ["Stopped", "Music stopped and disconnected from voice channel. 👋"] };
    }

    execute() {
        const queue = this.message.client.queue.get(this.message.guild.id);
        const result = this._run(this.message.member.voice.channel, queue, this.message.channel, this.message.guild.id, this.message.client);
        if (result.error)   return EmbedHelper.sendError(this.message.channel, ...result.error);
        this.message.channel.send({ embeds: [EmbedHelper.success(...result.success)] });
    }

    executeSlash(interaction) {
        const queue = interaction.client.queue.get(interaction.guild.id);
        const result = this._run(interaction.member.voice.channel, queue, interaction.channel, interaction.guild.id, interaction.client);
        if (result.error)   return interaction.reply({ embeds: [EmbedHelper.error(...result.error)], ephemeral: true });
        interaction.reply({ embeds: [EmbedHelper.success(...result.success)] });
    }
}

module.exports = Stop;
