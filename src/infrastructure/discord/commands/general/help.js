const { SlashCommandBuilder } = require('discord.js');
const Command         = require('../base/Command');
const CommandResolver = require('../base/CommandResolver');
const EmbedHelper     = require('../../../../shared/helpers/EmbedHelper');

const CATEGORIES = {
    '📌 General':     ['ping', 'help', 'avatar'],
    '🎵 Music':       ['play', 'stop', 'skip', 'queue', 'pause', 'resume', 'nowplaying', 'volume', 'loop'],
    '🛡️ Moderation': ['kick'],
    '⚙️ Admin':       ['reload'],
};

class Help extends Command {
    constructor(client) {
        super('help', 'List all commands or get info about a specific one.', client);
        this.usage           = '[command name]';
        this.aliases         = ['commands', 'h'];
        this.cooldown        = 5;
        this.category        = '📌 General';
        this.commandResolver = new CommandResolver();
    }

    get data() {
        return new SlashCommandBuilder()
            .setName('help')
            .setDescription(this.description)
            .addStringOption((opt) =>
                opt.setName('command').setDescription('Get detailed info about a specific command.'),
            );
    }

    _buildListEmbed(commands, prefixStr) {
        const embed = EmbedHelper.info('Command List', `Use \`${prefixStr}help [command]\` for detailed info on any command.`);
        for (const [category, names] of Object.entries(CATEGORIES)) {
            const available = names.filter((n) => commands.has(n));
            if (available.length) {
                embed.addFields({ name: category, value: available.map((n) => `\`${prefixStr}${n}\``).join('  ') });
            }
        }
        return embed;
    }

    _buildDetailEmbed(cmd, prefixStr) {
        const fields = [
            { name: 'Category', value: cmd.category || 'Uncategorized', inline: true },
            { name: 'Cooldown', value: `${cmd.cooldown || 3}s`,          inline: true },
        ];
        if (cmd.aliases?.length) fields.push({ name: 'Aliases', value: cmd.aliases.map((a) => `\`${a}\``).join('  '), inline: true });
        if (cmd.usage)           fields.push({ name: 'Usage',   value: `\`${prefixStr}${cmd.name} ${cmd.usage}\`` });

        return EmbedHelper.info(`${prefixStr}${cmd.name}`, cmd.description || 'No description.').addFields(...fields);
    }

    execute() {
        const { commands } = this.message.client;
        if (!this.args.length) return this.message.channel.send({ embeds: [this._buildListEmbed(commands, this.client.config?.prefix || '~')] });

        const CommandClass = this.commandResolver.resolve(commands, this.args[0].toLowerCase());
        if (!CommandClass) return EmbedHelper.sendError(this.message.channel, 'Unknown Command', `No command found with name or alias \`${this.args[0]}\`.`);

        this.message.channel.send({ embeds: [this._buildDetailEmbed(new CommandClass(null), this.client.config?.prefix || '~')] });
    }

    executeSlash(interaction) {
        const { commands } = interaction.client;
        const name = interaction.options.getString('command');

        if (!name) return interaction.reply({ embeds: [this._buildListEmbed(commands, '/')] });

        const CommandClass = this.commandResolver.resolve(commands, name.toLowerCase());
        if (!CommandClass) return interaction.reply({ embeds: [EmbedHelper.error('Unknown Command', `No command found with name \`${name}\`.`)], ephemeral: true });

        interaction.reply({ embeds: [this._buildDetailEmbed(new CommandClass(null), '/')] });
    }
}

module.exports = Help;
