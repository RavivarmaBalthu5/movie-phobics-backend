const axios = require('axios');
const cheerio = require('cheerio');

async function searchYouTube(query) {
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `https://www.youtube.com/results?search_query=${encodedQuery}`;

    try {
        // Fetch HTML content from YouTube
        const { data } = await axios.get(searchUrl);
        const $ = cheerio.load(data);

        const videos = [];
        const seenIds = new Set();
        const maxResults = 5;

        $('ytd-video-renderer').each((index, element) => {
            if (videos.length >= maxResults) return;

            const anchor = $(element).find('a#thumbnail');
            const titleElement = $(element).find('#video-title');
            const href = anchor.attr('href');
            const title = titleElement.text().trim();
            const idMatch = href.match(/\/watch\?v=([^&]+)/);
            const id = idMatch ? idMatch[1] : null;

            if (title && id && !seenIds.has(id)) {
                seenIds.add(id);
                videos.push({ _id: id, title });
            }
        });

        return videos;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

module.exports = {
    searchYouTube
};
