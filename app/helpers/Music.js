const IMusic = require("./IMusic");

class Music extends IMusic {
    constructor(name, time, url, thumbnail = null) {
        super();
        this.name = name;
        this.time = time;
        this.url = url;
        this.thumbnail = thumbnail;
    }

    getName() {
        return this.name;
    }

    getTime() {
        return this.time;
    }

    getUrl() {
        return this.url;
    }

    getThumbnail() {
        return this.thumbnail;
    }

    toString() {
        return `${this.name} [${this.time}] - ${this.url}`;
    }
}

module.exports = Music;
