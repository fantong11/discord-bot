const fs = require("fs");
const Discord = require("discord.js");
const { token } = require("./config.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

//////////////////////////////////////////////////////////////////////
// 拿到commands和events裡全部的檔案/////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // 一個指令名字對應一個指令檔案
    client.commands.set(command.name, command);
}

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    const emitter = (typeof event.emitter === "string" ? client[event.emitter] : event.emitter) || client;
    const once = event.once;

    client.events.set(event.name, event);
    try {
        emitter[once ? "once" : "on"](event.name, (...args) => event.execute(...args));
    } catch(error) {
        console.error(error.stack);
    }
}

client.login(token);