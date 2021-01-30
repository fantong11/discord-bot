const ytdl = require('ytdl-core');

module.exports = {
    name: "play",
    description: "Play music",
    async execute(message) {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            //connection.play("../01. Realize.mp3");
        }
    }
}