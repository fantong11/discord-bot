class HealthController {
    constructor(discordClient) {
        this.client = discordClient;
    }

    getStatus(req, res) {
        res.json({
            status: 'ok',
            uptime: process.uptime(),
            bot: {
                tag:    this.client.user?.tag    || 'not connected',
                guilds: this.client.guilds?.cache.size || 0,
                ping:   this.client.ws.ping,
            },
        });
    }
}

module.exports = HealthController;
