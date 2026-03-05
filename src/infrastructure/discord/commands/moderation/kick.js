const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Command = require('../base/Command');
const EmbedHelper = require('../../../../shared/helpers/EmbedHelper');

class Kick extends Command {
    constructor(client) {
        super('kick', 'Kick a user from the server.', client);
        this.argsIsRequired = true;
        this.usage = '[@User]';
        this.guildOnly = true;
        this.permissions = PermissionFlagsBits.KickMembers;
        this.category = '🛡️ Moderation';
    }

    get data() {
        return new SlashCommandBuilder()
            .setName('kick')
            .setDescription(this.description)
            .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
            .addUserOption((opt) =>
                opt.setName('user').setDescription('The user to kick.').setRequired(true)
            );
    }

    async executeSlash(interaction) {
        const member = interaction.options.getMember('user');
        if (!member) {
            return interaction.reply({ embeds: [EmbedHelper.error('Invalid User', 'Could not find that member.')], ephemeral: true });
        }

        try {
            await this.useCases.kickUser.execute({
                guildId: interaction.guild.id,
                targetUserId: member.id,
                requestorId: interaction.user.id
            });
            interaction.reply({ embeds: [EmbedHelper.success('User Kicked', `**${member.user.tag}** has been kicked from the server.`)] });
        } catch (error) {
            interaction.reply({ embeds: [EmbedHelper.error('Cannot Kick', error.message)], ephemeral: true });
        }
    }

    async execute() {
        const member = this.message.mentions.members.first();
        if (!member) return EmbedHelper.sendError(this.message.channel, 'Invalid User', 'Please mention a valid user to kick.');

        const confirmEmbed = EmbedHelper.warning(
            'Confirm Kick',
            `Are you sure you want to kick **${member.user.tag}**?\n\nReact ✅ to confirm or ❌ to cancel. *(15s timeout)*`
        ).setThumbnail(member.user.displayAvatarURL({ size: 128 }));

        const msg = await this.message.channel.send({ embeds: [confirmEmbed] });
        await msg.react('✅');
        await msg.react('❌');

        msg.awaitReactions({
            filter: (r, u) => ['✅', '❌'].includes(r.emoji.name) && u.id === this.message.author.id,
            max: 1,
            time: 15000,
            errors: ['time'],
        })
            .then(async (collected) => {
                if (collected.first().emoji.name === '✅') {
                    try {
                        await this.useCases.kickUser.execute({
                            guildId: this.message.guild.id,
                            targetUserId: member.id,
                            requestorId: this.message.author.id
                        });
                        msg.edit({ embeds: [EmbedHelper.success('User Kicked', `**${member.user.tag}** has been kicked.`)] });
                    } catch (error) {
                        msg.edit({ embeds: [EmbedHelper.error('Kick Failed', error.message)] });
                    }
                } else {
                    msg.edit({ embeds: [EmbedHelper.info('Cancelled', 'Kick was cancelled.')] });
                }
            })
            .catch(() => msg.edit({ embeds: [EmbedHelper.info('Timed Out', 'Kick confirmation timed out.')] }));
    }
}

module.exports = Kick;
