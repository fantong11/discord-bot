class MusicPlayer {
    constructor() {
        if (!MusicPlayer.instance) {
            MusicPlayer.instance = this;
        }
        return MusicPlayer.instance;
    }

    static getInstance() {
        return this.instance;
    }
}