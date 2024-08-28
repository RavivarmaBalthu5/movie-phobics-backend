const puppeteer = require('puppeteer');

async function searchYouTube(query) {
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `https://www.youtube.com/results?search_query=${encodedQuery}`;

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(searchUrl, { waitUntil: 'networkidle2' });

        // Wait for results to load
        await page.waitForSelector('ytd-video-renderer', { timeout: 10000 });

        const videos = await page.evaluate(() => {
            const results = [];
            const seenIds = new Set();
            const maxResults = 5;

            document.querySelectorAll('ytd-video-renderer').forEach(el => {
                if (results.length >= maxResults) return;

                const anchor = el.querySelector('a#thumbnail');
                const titleElement = el.querySelector('#video-title');
                const href = anchor ? anchor.getAttribute('href') : '';
                const title = titleElement ? titleElement.innerText.trim() : '';
                const idMatch = href ? href.match(/\/watch\?v=([^&]+)/) : null;
                const id = idMatch ? idMatch[1] : null;

                if (title && id && !seenIds.has(id)) {
                    seenIds.add(id);
                    results.push({ _id: id, title });
                }
            });

            return results;
        });

        await browser.close();
        console.log('Extracted videos:', videos);
        return videos;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

module.exports = {
    searchYouTube
};
