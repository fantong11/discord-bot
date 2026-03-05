// Aggregate root that owns the playback state for one guild.
class GuildQueue {
    constructor(guildId, textChannelId, voiceChannelId) {
        this.guildId        = guildId;
        this.textChannelId  = textChannelId;
        this.voiceChannelId = voiceChannelId;
        this.songs   = [];    // Track[]
        this.volume  = 0.3;   // normalised 0.0 – 1.0
        this.loop    = false;
        this.playing = false;
    }

    addTrack(track) {
        this.songs.push(track);
    }

    // Removes the current track (unless looping) and returns the next one, or null.
    advance() {
        if (!this.loop) this.songs.shift();
        return this.songs[0] || null;
    }

    get currentTrack() { return this.songs[0] || null; }
    get isEmpty()      { return this.songs.length === 0; }
    get size()         { return this.songs.length; }
}

module.exports = GuildQueue;
