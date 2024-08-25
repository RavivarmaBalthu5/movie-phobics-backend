const NodeCache = require('node-cache');
const { TMDB_API_ID, DEFAULT_LIMIT, API_COLLECTION, GOOGLE_YOUTUBE_API_ID } = require('../utils/constants');
const { find } = require('./db');
const apiKeyCache = new NodeCache({ stdTTL: 24 * 60 * 60 }); // Cache for 1 day

async function getTMDBApiKey() {
    const cacheKey = 'TMDB_API_KEY';

    // Check if the API key is in cache
    const cachedKey = apiKeyCache.get(cacheKey);
    if (cachedKey) {
        return cachedKey;
    }
    console.log(`getting api key from db`);

    // If not in cache, fetch from database
    const apiKey = await find(API_COLLECTION, { "_id": TMDB_API_ID }, {}, {}, DEFAULT_LIMIT);

    if (!apiKey || apiKey.length === 0) {
        throw new Error('TMDB API key is not set');
    }

    // Store the API key in cache with a TTL of 30 days
    apiKeyCache.set(cacheKey, apiKey[0].api_key); // Adjust according to your data structure

    return apiKey[0].api_key;
}

async function getGoogleApiKey() {
    const cacheKey = 'GOOGLE_YOUTUBE_API_KEY';

    // Check if the API key is in cache
    const cachedKey = apiKeyCache.get(cacheKey);
    if (cachedKey) {
        return cachedKey;
    }
    console.log(`getting google api key from db`);

    // If not in cache, fetch from database
    const apiKey = await find(API_COLLECTION, { "_id": GOOGLE_YOUTUBE_API_ID }, {}, {}, DEFAULT_LIMIT);

    if (!apiKey || apiKey.length === 0) {
        throw new Error('GOOGLE_YOUTUBE_API_KEY  is not set');
    }

    // Store the API key in cache with a TTL of 30 days
    apiKeyCache.set(cacheKey, apiKey[0].api_key); // Adjust according to your data structure

    return apiKey[0].api_key;
}
module.exports = {
    getTMDBApiKey,
    getGoogleApiKey
}