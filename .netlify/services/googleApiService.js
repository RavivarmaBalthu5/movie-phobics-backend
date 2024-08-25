const axios = require('axios');
const { GOOGLE_API_BASE_URL, MOVIE_VIDEOS_COLLECTION, DEFAULT_LIMIT } = require('../utils/constants');
const { mergeMovieVideoData, getMissingVideoIdsAndData } = require('../utils/utils');
const { find, upsertDocuments } = require('./db');
const { isEmpty } = require('lodash');

exports.searchMovieVideos = async (searchQuery, apiKey) => {
    try {
        const videoData = await this.getVideoData(searchQuery, apiKey);
        const videoIds = videoData.map(item => item.id.videoId);
        if (!videoIds || videoIds.length === 0) {
            return { message: "No videos found" };
        }

        let response = await find(MOVIE_VIDEOS_COLLECTION, { _id: { $in: videoIds } }, { "_id": 1, "details.contentDetails.duration": 1 }, {}, 5);
        const missingVideoIdsData = getMissingVideoIdsAndData(videoData, response);

        // Return a quick response
        if (isEmpty(missingVideoIdsData.missingVideoData)) {
            return response;
        }

        // Handle long operations asynchronously
        (async () => {
            try {
                console.log(`Mongo response is empty for these ${missingVideoIdsData.missingVideoIds}, so searching in Google video API`);
                let searchResponse = await this.searchVideoData(missingVideoIdsData.missingVideoData, missingVideoIdsData.missingVideoIds, apiKey);
                console.log(`Inserting merged response from Google video API`);
                await upsertDocuments(MOVIE_VIDEOS_COLLECTION, searchResponse, "_id");
            } catch (error) {
                console.log('Error during asynchronous processing', error.message);
            }
        })();

        return response;

    } catch (error) {
        console.log('Error in searchMovieVideos', error.message);
        throw error; // Ensure error is propagated
    }
};

exports.getVideoData = async (searchQuery, apiKey) => {
    try {
        const searchResponse = await axios.get(`${GOOGLE_API_BASE_URL}/search`, {
            params: {
                part: 'id',
                q: searchQuery,
                type: 'video',
                videoDuration: 'long',
                key: apiKey
            }
        });
        return searchResponse.data.items;
    } catch (error) {
        console.error('Error fetching video IDs:', error.message);
        throw new Error('Failed to fetch video IDs');
    }
};

exports.searchVideoData = async (missingVideoData, videoIds, apiKey) => {
    try {
        const detailsResponse = await axios.get(`${GOOGLE_API_BASE_URL}/videos`, {
            params: {
                part: 'snippet,contentDetails',
                id: videoIds,
                key: apiKey
            }
        });

        const videos = detailsResponse.data.items;
        return mergeMovieVideoData(missingVideoData, videos);  // Assuming an empty array for the first argument
    } catch (error) {
        console.error('Error fetching video details:', error.message);
        throw new Error('Failed to fetch video details');
    }
};
