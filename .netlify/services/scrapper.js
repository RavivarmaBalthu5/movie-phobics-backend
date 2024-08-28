const puppeteer = require('puppeteer-core');
exports.searchYouTube = async function (query) {
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `https://www.youtube.com/results?search_query=${encodedQuery}`;

    let browser = null;
    try {
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true,
        });

        const page = await browser.newPage();
        await page.goto(searchUrl, { waitUntil: 'networkidle2' });

        // Scroll to load more results if needed
        await autoScroll(page);

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
                const idMatch = href.match(/\/watch\?v=([^&]+)/);
                const id = idMatch ? idMatch[1] : null;

                if (title && id && !seenIds.has(id)) {
                    seenIds.add(id);
                    results.push({ _id: id, title });
                }
            });

            return results;
        });

        return videos;
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

async function autoScroll(page) {
    await page.evaluate(async () => {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        const distance = 100;
        const delayTime = 1000;

        while (true) {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);

            await delay(delayTime);

            if (document.body.scrollHeight <= scrollHeight) break;
        }
    });
}
