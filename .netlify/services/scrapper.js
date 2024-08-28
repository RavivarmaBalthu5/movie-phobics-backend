const { chromium } = require('playwright');

async function searchYouTube(query) {
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `https://www.youtube.com/results?search_query=${encodedQuery}`;

    try {
        // Launch browser in headless mode
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(searchUrl, { waitUntil: 'networkidle' });

        // Scroll to load more results if needed
        await autoScroll(page);

        // Extract video URLs, titles, and IDs
        const videos = await page.evaluate(() => {
            const results = [];
            const seenIds = new Set(); // To track unique video IDs
            const maxResults = 5; // Limit to 5 results

            document.querySelectorAll('ytd-video-renderer').forEach(el => {
                if (results.length >= maxResults) return; // Stop if we have enough results

                const anchor = el.querySelector('a#thumbnail');
                const titleElement = el.querySelector('#video-title');
                const href = anchor ? anchor.getAttribute('href') : '';
                const title = titleElement ? titleElement.innerText.trim() : '';
                const idMatch = href.match(/\/watch\?v=([^&]+)/);
                const id = idMatch ? idMatch[1] : null;

                if (title && id && !seenIds.has(id)) {
                    seenIds.add(id); // Mark this ID as seen
                    results.push({ _id: id, title });
                }
            });

            return results;
        });

        await browser.close();
        return videos;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Function to handle scrolling
async function autoScroll(page) {
    await page.evaluate(async () => {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        const distance = 100; // Distance to scroll
        const delayTime = 1000; // Time to wait for new content to load

        while (true) {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);

            await delay(delayTime);

            if (document.body.scrollHeight <= scrollHeight) break; // Exit if no more content
        }
    });
}

module.exports = {
    searchYouTube
};
