// All configuration values are read from environment variables.
// Call require('dotenv').config() in the composition root (index.js) before importing this.
module.exports = {
    prefix: process.env.PREFIX || '~',
    token:  process.env.TOKEN,
    port:   parseInt(process.env.PORT || '3000', 10),
};
