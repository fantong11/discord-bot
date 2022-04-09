const IMusic = require("./IMusic");

class MusicList extends IMusic {
    constructor(name, time, url) {
        this.musicList = [];
        this.name = name;
        this.time = time;
        this.url = url;
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

    add(music) {
        this.musicList.push(music);
    }
}

module.exports = MusicList;