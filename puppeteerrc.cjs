const { join } = require('path');

/**
 * @type {import("puppeteer-core").Configuration}
 */
module.exports = {
    cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};