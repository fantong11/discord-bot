const { SlashCommandBuilder } = require("discord.js");
const Command = require("../helpers/Command");
const EmbedHelper = require("../helpers/EmbedHelper");

class Ping extends Command {
    constructor() {
        super("ping", "Check bot latency and WebSocket heartbeat.");
        this.category = "📌 General";
    }

    get data() {
        return new SlashCommandBuilder()
            .setName("ping")
            .setDescription(this.description);
    }

    _buildEmbed(client, createdTimestamp) {
        return EmbedHelper.info("Pong! 🏓").addFields(
            { name: "Message Latency",     value: `${Date.now() - createdTimestamp}ms`, inline: true },
            { name: "WebSocket Heartbeat", value: `${Math.round(client.ws.ping)}ms`,    inline: true }
        );
    }

    execute() {
        this.message.channel.send({ embeds: [this._buildEmbed(this.message.client, this.message.createdTimestamp)] });
    }

    executeSlash(interaction) {
        interaction.reply({ embeds: [this._buildEmbed(interaction.client, interaction.createdTimestamp)] });
    }
}

module.exports = Ping;
