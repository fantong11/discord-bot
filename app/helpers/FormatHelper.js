class FormatHelper {
    // Converts seconds → "M:SS" or "H:MM:SS"
    static duration(seconds) {
        const s = parseInt(seconds, 10);
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        if (h > 0) {
            return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
        }
        return `${m}:${String(sec).padStart(2, "0")}`;
    }

    // Renders a visual volume bar: "██████░░░░ 60%"
    static volumeBar(volume, length = 10) {
        const filled = Math.round(volume * length);
        const empty = length - filled;
        return `${"█".repeat(filled)}${"░".repeat(empty)}  ${Math.round(volume * 100)}%`;
    }
}

module.exports = FormatHelper;
