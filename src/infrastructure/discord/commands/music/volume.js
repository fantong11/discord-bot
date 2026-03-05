const { SlashCommandBuilder } = require('discord.js');
const Command      = require('../base/Command');
const EmbedHelper  = require('../../../../shared/helpers/EmbedHelper');
const FormatHelper = require('../../../../shared/helpers/FormatHelper');

class Volume extends Command {
    constructor(client) {
        super('volume', 'Set the playback volume (0–100).', client);
        this.guildOnly      = true;
        this.argsIsRequired = true;
        this.usage          = '<0-100>';
        this.aliases        = ['vol'];
        this.category       = '🎵 Music';
    }

    get data() {
        return new SlashCommandBuilder()
            .setName('volume')
            .setDescription(this.description)
            .addIntegerOption((opt) =>
                opt.setName('level').setDescription('Volume level (0–100).').setRequired(true).setMinValue(0).setMaxValue(100),
            );
    }

    async _run(guildId, vol) {
        const result = await this.useCases.setVolume.execute({ guildId, volume: vol });
        if (result.status === 'nothing_playing') return { error: ['Nothing Playing', 'There is nothing playing right now.'] };
        if (result.status === 'invalid_volume')  return { error: ['Invalid Volume', 'Please provide a number between **0** and **100**.'] };
        return { bar: FormatHelper.volumeBar(result.normalizedVolume) };
    }

    async execute() {
        const result = await this._run(this.message.guild.id, parseInt(this.args[0], 10));
        if (result.error) return EmbedHelper.sendError(this.message.channel, ...result.error);
        this.message.channel.send({ embeds: [EmbedHelper.success('Volume Updated', result.bar)] });
    }

    async executeSlash(interaction) {
        const result = await this._run(interaction.guild.id, interaction.options.getInteger('level'));
        if (result.error) return interaction.reply({ embeds: [EmbedHelper.error(...result.error)], ephemeral: true });
        interaction.reply({ embeds: [EmbedHelper.success('Volume Updated', result.bar)] });
    }
}

module.exports = Volume;
