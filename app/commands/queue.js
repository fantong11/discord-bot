const { SlashCommandBuilder } = require("discord.js");
const Command = require("../helpers/Command");
const EmbedHelper = require("../helpers/EmbedHelper");
const FormatHelper = require("../helpers/FormatHelper");

const PAGE_SIZE = 10;

class Queue extends Command {
    constructor() {
        super("queue", "Show the current music queue.");
        this.guildOnly = true;
        this.aliases = ["q"];
        this.usage = "[page]";
        this.category = "🎵 Music";
    }

    get data() {
        return new SlashCommandBuilder()
            .setName("queue")
            .setDescription(this.description)
            .addIntegerOption((opt) =>
                opt.setName("page").setDescription("Page number.").setMinValue(1)
            );
    }

    _buildEmbed(queue, page) {
        if (!queue?.songs.length) return null;
        const total = queue.songs.length;
        const totalPages = Math.ceil(total / PAGE_SIZE);
        const clampedPage = Math.min(Math.max(1, page), totalPages);
        const start = (clampedPage - 1) * PAGE_SIZE;
        const lines = queue.songs.slice(start, start + PAGE_SIZE).map((song, i) => {
            const index = start + i;
            return `${index === 0 ? "▶" : `${index}.`}  **${song.getName()}**  \`${FormatHelper.duration(song.getTime())}\``;
        });
        return EmbedHelper.music(`Queue  •  ${total} song(s)`, lines.join("\n"))
            .setFooter({ text: `Page ${clampedPage}/${totalPages}  •  DiscordBot` });
    }

    execute() {
        const embed = this._buildEmbed(this.message.client.queue.get(this.message.guild.id), parseInt(this.args[0], 10) || 1);
        if (!embed) return EmbedHelper.sendError(this.message.channel, "Queue Empty", "There are no songs in the queue.");
        this.message.channel.send({ embeds: [embed] });
    }

    executeSlash(interaction) {
        const embed = this._buildEmbed(interaction.client.queue.get(interaction.guild.id), interaction.options.getInteger("page") || 1);
        if (!embed) return interaction.reply({ embeds: [EmbedHelper.error("Queue Empty", "There are no songs in the queue.")], ephemeral: true });
        interaction.reply({ embeds: [embed] });
    }
}

module.exports = Queue;
