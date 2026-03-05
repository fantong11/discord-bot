const ytdl = require('ytdl-core');
const ITrackInfoService = require('../../application/ports/ITrackInfoService');

class YtdlTrackInfoService extends ITrackInfoService {
    async getInfo(url) {
        const info = await ytdl.getInfo(url);
        const { title, lengthSeconds, thumbnails } = info.videoDetails;
        const thumbnailUrl = thumbnails?.[thumbnails.length - 1]?.url || null;
        return { title, durationSeconds: parseInt(lengthSeconds, 10), thumbnailUrl };
    }
}

module.exports = YtdlTrackInfoService;
