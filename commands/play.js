const ytdl = require('ytdl-core');

module.exports = {
    name: "play",
    description: "Play music",
    args: true,
    aliases: ["p"],
    usage: "<YouTube Link>",
    cooldowns: 5,
    async execute(message, args) {
        const url = args[0];
        const urlPattern = /^(https?:\/\/)?(www\.)?(m\.)/gi;
        const defaultVolume = 0.3;

        const queueConstruct = {
            textChannel: message.channel || message.member.voice.channel,
            connection: null,
            songs: [],
            loop: false,
            volume: defaultVolume || 0.3,
            playing: true,
        };

        try {
            // 加入聊天室
            queueConstruct.connection = await message.member.voice.channel.join();
            // 設定拒聽
            await queueConstruct.connection.voice.setSelfDeaf(true);
            queueConstruct.connection.play(ytdl(url, { filter: "audioonly" }));
        } catch(error) {
            console.error(error);
            message.client.queue.delete(message.guild.id);
            await message.client.channel.leave();
            return message.client.send("Something wrong");
        }
    }
}