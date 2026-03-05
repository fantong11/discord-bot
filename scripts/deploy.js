/**
 * Deploy slash commands to Discord.
 *
 * Guild deploy (instant):   node scripts/deploy.js <GUILD_ID>
 * Global deploy (≤1 hour):  node scripts/deploy.js
 *
 * Get your Guild ID: right-click your server icon → Copy Server ID
 * (Enable Developer Mode in Discord Settings → Advanced first)
 */

require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

const clientId = Buffer.from(process.env.TOKEN.split(".")[0], "base64").toString("ascii");
const guildId  = process.argv[2]; // optional: node scripts/deploy.js <GUILD_ID>

const commands = [];
const commandFiles = fs
    .readdirSync(path.join(__dirname, "../app/commands"))
    .filter((f) => f.endsWith(".js"));

for (const file of commandFiles) {
    const CommandClass = require(path.join(__dirname, "../app/commands", file));
    const instance = new CommandClass();
    if (instance.data) {
        commands.push(instance.data.toJSON());
        console.log(`  ✔ ${instance.data.name}`);
    }
}

const rest = new REST().setToken(process.env.TOKEN);
const route = guildId
    ? Routes.applicationGuildCommands(clientId, guildId)
    : Routes.applicationCommands(clientId);

(async () => {
    const scope = guildId ? `guild ${guildId} (instant)` : "globally (up to 1 hour)";
    console.log(`\nDeploying ${commands.length} slash command(s) ${scope}…`);
    await rest.put(route, { body: commands });
    console.log("Done!");
})();
