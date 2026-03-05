const { EmbedBuilder } = require("discord.js");

// Centralized embed factory — enforces consistent style across all commands.
const COLORS = {
    info:    0x5865F2, // Discord Blurple
    success: 0x57F287, // Discord Green
    error:   0xED4245, // Discord Red
    warning: 0xFEE75C, // Discord Yellow
    music:   0xEB459E, // Discord Fuchsia
};

class EmbedHelper {
    static _base(color) {
        return new EmbedBuilder()
            .setColor(color)
            .setTimestamp()
            .setFooter({ text: "DiscordBot" });
    }

    static info(title, description = null) {
        return this._base(COLORS.info).setTitle(title).setDescription(description);
    }

    static success(title, description = null) {
        return this._base(COLORS.success).setTitle(`✅  ${title}`).setDescription(description);
    }

    static error(title, description = null) {
        return this._base(COLORS.error).setTitle(`❌  ${title}`).setDescription(description);
    }

    static warning(title, description = null) {
        return this._base(COLORS.warning).setTitle(`⚠️  ${title}`).setDescription(description);
    }

    static music(title, description = null) {
        return this._base(COLORS.music).setTitle(`🎵  ${title}`).setDescription(description);
    }

    // Sends an error embed and auto-deletes after `timeout` ms to keep channels clean.
    static sendError(channel, title, description = null, timeout = 8000) {
        return channel.send({ embeds: [this.error(title, description)] }).then((msg) => {
            setTimeout(() => msg.delete().catch(() => {}), timeout);
            return msg;
        });
    }
}

module.exports = EmbedHelper;
