const fs = require("fs");
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require('ytdl-core');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

console.log(client.commands);

client.once("ready", () => {
    console.log("Ready!");
});

client.once("reconnecting", () => {
    console.log("Reconnecting!");
});

client.once("disconnect", () => {
    console.log("Disconnect!");
});

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    // 拿掉前面prefix的長度
    const commandBody = message.content.slice(prefix.length);
    // 分割字串
    const args = commandBody.split(" ");
    // 陣列左移再變小寫
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    try {
        command.execute(message, args);
    }
    catch(error) {
        console.log(error);
        message.reply("There was an error trying to execute that command!");
    }    
});

client.login(token);