const { SlashCommandBuilder } = require('discord.js');
const Command     = require('../base/Command');
const EmbedHelper = require('../../../../shared/helpers/EmbedHelper');

class Avatar extends Command {
    constructor(client) {
        super('avatar', 'Show your avatar or another user\'s avatar.', client);
        this.usage    = '[@User]';
        this.aliases  = ['icon', 'pfp'];
        this.category = '📌 General';
    }

    get data() {
        return new SlashCommandBuilder()
            .setName('avatar')
            .setDescription(this.description)
            .addUserOption((opt) =>
                opt.setName('user').setDescription('The user whose avatar to show (defaults to you).'),
            );
    }

    _buildEmbed(user) {
        const url = user.displayAvatarURL({ size: 512 });
        return EmbedHelper.info(`${user.username}'s Avatar`)
            .setImage(url)
            .setDescription(`[Open in browser](${url})`);
    }

    execute() {
        const target = this.message.mentions.users.first() || this.message.author;
        this.message.channel.send({ embeds: [this._buildEmbed(target)] });
    }

    executeSlash(interaction) {
        const target = interaction.options.getUser('user') || interaction.user;
        interaction.reply({ embeds: [this._buildEmbed(target)] });
    }
}

module.exports = Avatar;
