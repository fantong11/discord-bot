const { SlashCommandBuilder } = require("discord.js");
const Command = require("../helpers/Command");
const EmbedHelper = require("../helpers/EmbedHelper");

class Skip extends Command {
    constructor() {
        super("skip", "Skip the current song.");
        this.guildOnly = true;
        this.aliases = ["s"];
        this.category = "🎵 Music";
    }

    get data() {
        return new SlashCommandBuilder().setName("skip").setDescription(this.description);
    }

    _run(voiceChannel, queue) {
        if (!voiceChannel)              return { error: ["Not in Voice Channel", "You need to be in a voice channel to skip!"] };
        if (!queue?.songs.length)       return { error: ["Nothing to Skip", "There is nothing playing right now."] };
        const name = queue.songs[0].getName();
        queue.audioPlayer.stop();
        return { success: ["Skipped", `Skipped **${name}**.`] };
    }

    execute() {
        const result = this._run(this.message.member.voice.channel, this.message.client.queue.get(this.message.guild.id));
        if (result.error)   return EmbedHelper.sendError(this.message.channel, ...result.error);
        this.message.channel.send({ embeds: [EmbedHelper.success(...result.success)] });
    }

    executeSlash(interaction) {
        const result = this._run(interaction.member.voice.channel, interaction.client.queue.get(interaction.guild.id));
        if (result.error)   return interaction.reply({ embeds: [EmbedHelper.error(...result.error)], ephemeral: true });
        interaction.reply({ embeds: [EmbedHelper.success(...result.success)] });
    }
}

module.exports = Skip;
