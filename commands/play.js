const { VoiceChannel } = require('discord.js');
const ytdl = require('ytdl-core');

module.exports = {
    name: "play",
    description: "Play music",
    args: true,
    aliases: ["p"],
    usage: "<YouTube Link>",
    cooldowns: 5,
    async execute(message, args) {
        const link = args[0];
        const defaultVolume = 0.3;
        const connection = await message.member.voice.channel.join();
        const dispatcher = connection.play(ytdl(link, { filter: "audioonly" }));
        console.log(message.client.queue.get(message.guild.id));
        dispatcher.setVolume(defaultVolume);
        dispatcher.on("finish", () => message.member.voice.channel.leave());
    }
}