const { find } = require("../services/db");
const { BASE_URL, TMDB_API_ID, API_COLLECTION, DEFAULT_LIMIT } = require("../utils/constants");
const { prepareResponse } = require("../utils/utils");
const axios = require('axios');

const getInitialMovies = async () => {

    try {
        const TMDB_API_KEY = await find(API_COLLECTION, { "_id": TMDB_API_ID }, null, DEFAULT_LIMIT)
        if (!TMDB_API_KEY) {
            return prepareResponse(500, { error: 'TMDB API key is not set' });
        }
        // Search for the movie to get the ID
        const searchResponse = await axios.get(`${BASE_URL}movie/popular?api_key=${TMDB_API_KEY[0]?.api_key}&language=en-US&page=1`);

        if (searchResponse.data.results.length === 0) {
            return prepareResponse(400, { error: 'Movies not found' })
        }
        return prepareResponse(200, searchResponse.data.results);
    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching initial movie data', details: error.message });
    }
}
module.exports = {
    getInitialMovies
}