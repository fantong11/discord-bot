const IMusic = require("./IMusic");

class Music extends IMusic {
    constructor(name, time, url) {
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

    toString() {
        return this.name + this.time + this.url;
    }
}

module.exports = Music;