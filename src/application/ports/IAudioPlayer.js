// Port: controls voice-channel audio playback.
class IAudioPlayer {
    async connect(guildId, voiceChannelId) { throw new Error('Not implemented'); }
    async play(guildId, track, volume)     { throw new Error('Not implemented'); }
    async stop(guildId)                    { throw new Error('Not implemented'); }
    async pause(guildId)                   { throw new Error('Not implemented'); }
    async resume(guildId)                  { throw new Error('Not implemented'); }
    async setVolume(guildId, volume)       { throw new Error('Not implemented'); }
    async skip(guildId)                    { throw new Error('Not implemented'); }
}

module.exports = IAudioPlayer;
