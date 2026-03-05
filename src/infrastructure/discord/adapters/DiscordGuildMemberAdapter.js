class DiscordGuildMemberAdapter {
    constructor(client) {
        this.client = client;
    }

    async isKickable(guildId, userId) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return false;

        try {
            const member = await guild.members.fetch(userId);
            return member ? member.kickable : false;
        } catch (e) {
            return false; // User not found
        }
    }

    async kickUser(guildId, userId) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) throw new Error("Guild not found");

        const member = await guild.members.fetch(userId);
        if (!member) throw new Error("Member not found");

        const userTag = member.user.tag;
        await member.kick();
        return { id: userId, tag: userTag };
    }
}

module.exports = DiscordGuildMemberAdapter;
