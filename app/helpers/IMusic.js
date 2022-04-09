class IMusic {
    constructor() {
        if (this.constructor == IMusic) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    add(music) {
        throw new Error("Method add() must be implemented.");
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

    getSize() {
        throw new Error("Method getSize() must be implemented.");
    }

    toString() {
        throw new Error("Method toString() must be implemented.");
    }
}

module.exports = IMusic;