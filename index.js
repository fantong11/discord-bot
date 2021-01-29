const Discord = require("discord.js");
const config = require("./config.json");
const ytdl = require('ytdl-core');

const client = new Discord.Client();

const prefix = "~";

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    // 拿掉前面prefix的長度
    const commandBody = message.content.slice(prefix.length);
    // 分割字串
    const args = commandBody.split(" ");
    // 陣列左移再變小寫
    const command = args.shift().toLowerCase();
    if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`${timeTaken}ms`);
    }
    if (command === "play") {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            connection.play("01. Realize.mp3");
        }
    }
    
});

client.login(config.BOT_TOKEN);