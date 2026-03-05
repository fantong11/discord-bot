const { SlashCommandBuilder } = require("discord.js");
const Command = require("../helpers/Command");
const EmbedHelper = require("../helpers/EmbedHelper");
const FormatHelper = require("../helpers/FormatHelper");

class NowPlaying extends Command {
    constructor() {
        super("nowplaying", "Show the currently playing song.");
        this.guildOnly = true;
        this.aliases = ["np"];
        this.category = "🎵 Music";
    }

    get data() {
        return new SlashCommandBuilder().setName("nowplaying").setDescription(this.description);
    }

    _buildEmbed(queue) {
        if (!queue?.songs.length) return null;
        const song = queue.songs[0];
        const embed = EmbedHelper.music("Now Playing", `**[${song.getName()}](${song.getUrl()})**`)
            .addFields(
                { name: "Duration", value: FormatHelper.duration(song.getTime()),      inline: true },
                { name: "Volume",   value: FormatHelper.volumeBar(queue.volume),       inline: true },
                { name: "Loop",     value: queue.loop ? "🔁 On" : "➡️ Off",           inline: true },
                { name: "Status",   value: queue.playing ? "▶️ Playing" : "⏸️ Paused", inline: true },
                { name: "Queue",    value: `${queue.songs.length} song(s)`,            inline: true }
            );
        if (song.getThumbnail()) embed.setThumbnail(song.getThumbnail());
        return embed;
    }

    execute() {
        const embed = this._buildEmbed(this.message.client.queue.get(this.message.guild.id));
        if (!embed) return EmbedHelper.sendError(this.message.channel, "Nothing Playing", "There is nothing playing right now.");
        this.message.channel.send({ embeds: [embed] });
    }

    executeSlash(interaction) {
        const embed = this._buildEmbed(interaction.client.queue.get(interaction.guild.id));
        if (!embed) return interaction.reply({ embeds: [EmbedHelper.error("Nothing Playing", "There is nothing playing right now.")], ephemeral: true });
        interaction.reply({ embeds: [embed] });
    }
}

module.exports = NowPlaying;
