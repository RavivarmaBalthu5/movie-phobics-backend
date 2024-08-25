const NodeCache = require('node-cache');
const { TMDB_API_ID, DEFAULT_LIMIT, API_COLLECTION, SPOTIFY_TOKEN_URL } = require('../utils/constants');
const { find } = require('./db');
const apiKeyCache = new NodeCache({ stdTTL: 24 * 60 * 60 }); // Cache for 1 day
const axios = require('axios');
const querystring = require('querystring');

const spotifyCache = new NodeCache({ stdTTL: 3600 }); // Cache TTL in seconds
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

const getSpotifyToken = async () => {
    const cachedToken = spotifyCache.get('accessToken');
    if (cachedToken) {
        console.log("token fetched from cache");
        return cachedToken;
    }
    console.log("token expired, fetching new token");

    let cliendCreds = await find(API_COLLECTION, { "_id": "spotify_creds" }, {}, {}, DEFAULT_LIMIT);
    if (!cliendCreds) {
        throw new Error('Spotify credentials are not set');
    }
    try {
        const response = await axios.post(SPOTIFY_TOKEN_URL, querystring.stringify({
            grant_type: 'client_credentials',
            client_id: cliendCreds[0].client_id,
            client_secret: cliendCreds[0].client_secret,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const token = response.data.access_token;
        spotifyCache.set('accessToken', token, response.data.expires_in); // Cache token with expiration time
        return token;
    } catch (error) {
        console.error('Error fetching access token:', error);
    }
};

module.exports = {
    getTMDBApiKey,
    getSpotifyToken
}