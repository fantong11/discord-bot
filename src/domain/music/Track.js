// Immutable value object representing a playable track.
class Track {
    constructor(name, durationSeconds, url, thumbnailUrl = null) {
        this.name            = name;
        this.durationSeconds = parseInt(durationSeconds, 10);
        this.url             = url;
        this.thumbnailUrl    = thumbnailUrl;
        Object.freeze(this);
    }
}

module.exports = Track;
