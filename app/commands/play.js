const ytdl = require('ytdl-core');
const Command = require("../helpers/Command");

class Play extends Command {
    constructor() {
        super("play", "Play music")
        this.argsIsRequired = true;
        this.aliases = ["p"];
        this.usage = "<YouTube Link>";
        this.cooldowns = 5;
    }

    async execute() {
        const url = this.args[0];
        const urlPattern = /^(https?:\/\/)?(www\.)?(m\.)/gi;
        const defaultVolume = 0.3;

        const queueConstruct = {
            textChannel: this.message.channel || this.message.member.voice.channel,
            connection: null,
            songs: [],
            loop: false,
            volume: defaultVolume || 0.3,
            playing: true,
        };

        try {
            // 加入聊天室
            queueConstruct.connection = await this.message.member.voice.channel.join();
            // 設定拒聽
            await queueConstruct.connection.voice.setSelfDeaf(true);
            queueConstruct.connection.play(ytdl(url, { filter: "audioonly" }));
        } catch(error) {
            console.error(error);
            this.message.client.queue.delete(message.guild.id);
            await message.client.channel.leave();
            return message.client.send("Something wrong");
        }
    }
}

module.exports = Play;