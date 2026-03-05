// ISP: IMusic only defines the contract for a single music track.
// Collection behaviour (add, getSize) lives in IPlaylist.
class IMusic {
    constructor() {
        if (this.constructor === IMusic) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    getName() {
        throw new Error("Method getName() must be implemented.");
    }

    getTime() {
        throw new Error("Method getTime() must be implemented.");
    }

    getUrl() {
        throw new Error("Method getUrl() must be implemented.");
    }

    getThumbnail() {
        throw new Error("Method getThumbnail() must be implemented.");
    }

    toString() {
        throw new Error("Method toString() must be implemented.");
    }
}

module.exports = IMusic;
