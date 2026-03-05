const { SlashCommandBuilder } = require("discord.js");
const Command = require("../helpers/Command");
const EmbedHelper = require("../helpers/EmbedHelper");
const FormatHelper = require("../helpers/FormatHelper");

class Volume extends Command {
    constructor() {
        super("volume", "Set the playback volume (0–100).");
        this.guildOnly = true;
        this.argsIsRequired = true;
        this.usage = "<0-100>";
        this.aliases = ["vol"];
        this.category = "🎵 Music";
    }

    get data() {
        return new SlashCommandBuilder()
            .setName("volume")
            .setDescription(this.description)
            .addIntegerOption((opt) =>
                opt.setName("level").setDescription("Volume level (0–100).").setRequired(true).setMinValue(0).setMaxValue(100)
            );
    }

    _run(queue, vol) {
        if (!queue?.currentResource) return { error: ["Nothing Playing", "There is nothing playing right now."] };
        if (isNaN(vol) || vol < 0 || vol > 100) return { error: ["Invalid Volume", "Please provide a number between **0** and **100**."] };
        queue.volume = vol / 100;
        queue.currentResource.volume.setVolume(queue.volume);
        return { bar: FormatHelper.volumeBar(queue.volume) };
    }

    execute() {
        const result = this._run(this.message.client.queue.get(this.message.guild.id), parseInt(this.args[0], 10));
        if (result.error) return EmbedHelper.sendError(this.message.channel, ...result.error);
        this.message.channel.send({ embeds: [EmbedHelper.success("Volume Updated", result.bar)] });
    }

    executeSlash(interaction) {
        const result = this._run(interaction.client.queue.get(interaction.guild.id), interaction.options.getInteger("level"));
        if (result.error) return interaction.reply({ embeds: [EmbedHelper.error(...result.error)], ephemeral: true });
        interaction.reply({ embeds: [EmbedHelper.success("Volume Updated", result.bar)] });
    }
}

module.exports = Volume;
