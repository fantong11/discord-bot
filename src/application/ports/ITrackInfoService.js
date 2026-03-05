// Port: fetches metadata for a given track URL.
// Returns: { title: string, durationSeconds: number, thumbnailUrl: string|null }
class ITrackInfoService {
    async getInfo(url) { throw new Error('Not implemented'); }
}

module.exports = ITrackInfoService;
