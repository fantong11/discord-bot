const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Command = require("../helpers/Command");
const EmbedHelper = require("../helpers/EmbedHelper");

class Kick extends Command {
    constructor() {
        super("kick", "Kick a user from the server.");
        this.argsIsRequired = true;
        this.usage = "[@User]";
        this.guildOnly = true;
        this.permissions = PermissionFlagsBits.KickMembers;
        this.category = "🛡️ Moderation";
    }

    get data() {
        return new SlashCommandBuilder()
            .setName("kick")
            .setDescription(this.description)
            .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
            .addUserOption((opt) =>
                opt.setName("user").setDescription("The user to kick.").setRequired(true)
            );
    }

    // Slash: direct confirmation embed (no reactions needed — intent is explicit)
    async executeSlash(interaction) {
        const member = interaction.options.getMember("user");
        if (!member) return interaction.reply({ embeds: [EmbedHelper.error("Invalid User", "Could not find that member.")], ephemeral: true });
        if (!member.kickable) return interaction.reply({ embeds: [EmbedHelper.error("Cannot Kick", "I don't have permission to kick this user.")], ephemeral: true });

        await member.kick();
        interaction.reply({ embeds: [EmbedHelper.success("User Kicked", `**${member.user.tag}** has been kicked from the server.`)] });
    }

    // Prefix: reaction confirmation (safer for typed commands)
    async execute() {
        const member = this.message.mentions.members.first();
        if (!member) return EmbedHelper.sendError(this.message.channel, "Invalid User", "Please mention a valid user to kick.");
        if (!member.kickable) return EmbedHelper.sendError(this.message.channel, "Cannot Kick", "I don't have permission to kick this user.");

        const confirmEmbed = EmbedHelper.warning(
            "Confirm Kick",
            `Are you sure you want to kick **${member.user.tag}**?\n\nReact ✅ to confirm or ❌ to cancel. *(15s timeout)*`
        ).setThumbnail(member.user.displayAvatarURL({ size: 128 }));

        const msg = await this.message.channel.send({ embeds: [confirmEmbed] });
        await msg.react("✅");
        await msg.react("❌");

        msg.awaitReactions({
            filter: (r, u) => ["✅", "❌"].includes(r.emoji.name) && u.id === this.message.author.id,
            max: 1, time: 15000, errors: ["time"],
        })
            .then((collected) => {
                if (collected.first().emoji.name === "✅") {
                    member.kick()
                        .then(() => msg.edit({ embeds: [EmbedHelper.success("User Kicked", `**${member.user.tag}** has been kicked.`)] }))
                        .catch(() => msg.edit({ embeds: [EmbedHelper.error("Kick Failed", "Could not kick the user.")] }));
                } else {
                    msg.edit({ embeds: [EmbedHelper.info("Cancelled", "Kick was cancelled.")] });
                }
            })
            .catch(() => msg.edit({ embeds: [EmbedHelper.info("Timed Out", "Kick confirmation timed out.")] }));
    }
}

module.exports = Kick;
