const { Router } = require('express');

function healthRoutes(controller) {
    const router = Router();
    router.get('/', (req, res) => controller.getStatus(req, res));
    return router;
}

module.exports = healthRoutes;
