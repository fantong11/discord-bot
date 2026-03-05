/**
 * Deploy slash commands to Discord.
 *
 * Guild deploy (instant):   node scripts/deploy.js <GUILD_ID>
 * Global deploy (≤1 hour):  node scripts/deploy.js
 *
 * Get your Guild ID: right-click your server icon → Copy Server ID
 * (Enable Developer Mode in Discord Settings → Advanced first)
 */

require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs   = require('fs');
const path = require('path');

const clientId = Buffer.from(process.env.TOKEN.split('.')[0], 'base64').toString('ascii');
const guildId  = process.argv[2]; // optional: node scripts/deploy.js <GUILD_ID>

const commands = [];
const commandsRoot = path.join(__dirname, '../src/infrastructure/discord/commands');

for (const category of ['general', 'music', 'moderation', 'admin']) {
    const dir = path.join(commandsRoot, category);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.js'))) {
        const CommandClass = require(path.join(dir, file));
        // Pass null as client — deploy only reads metadata (data getter), never executes.
        const instance = new CommandClass(null);
        if (instance.data) {
            commands.push(instance.data.toJSON());
            console.log(`  ✔ ${instance.data.name}`);
        }
    }
}

const rest   = new REST().setToken(process.env.TOKEN);
const route  = guildId
    ? Routes.applicationGuildCommands(clientId, guildId)
    : Routes.applicationCommands(clientId);

(async () => {
    const scope = guildId ? `guild ${guildId} (instant)` : 'globally (up to 1 hour)';
    console.log(`\nDeploying ${commands.length} slash command(s) ${scope}…`);
    await rest.put(route, { body: commands });
    console.log('Done!');
})();
