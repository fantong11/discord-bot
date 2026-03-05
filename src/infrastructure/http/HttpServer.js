const express           = require('express');
const HealthController  = require('./controllers/HealthController');
const healthRoutes      = require('./routes/healthRoutes');

class HttpServer {
    constructor(discordClient) {
        this.app    = express();
        this.client = discordClient;
        this._setup();
    }

    _setup() {
        const healthController = new HealthController(this.client);
        this.app.use('/health', healthRoutes(healthController));
    }

    start(port) {
        this.app.listen(port, () => {
            console.log(`[HTTP] Health server listening on port ${port}`);
        });
    }
}

module.exports = HttpServer;
