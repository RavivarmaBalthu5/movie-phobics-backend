const { find } = require("../services/db");
const { BASE_URL, API_COLLECTION, TMDB_API_ID, DEFAULT_LIMIT } = require("../utils/constants");
const { prepareResponse } = require("../utils/utils");
const axios = require('axios');

const searchMovie = async (movieName) => {
    try {
        const TMDB_API_KEY = await find(API_COLLECTION, { "_id": TMDB_API_ID }, null, DEFAULT_LIMIT)[0]?.api_key;
        if (!TMDB_API_KEY) {
            return prepareResponse(500, { error: 'TMDB API key is not set' });
        }
        // Search for the movie to get the ID
        const searchResponse = await axios.get(`${BASE_URL}search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movieName)}`);

        if (searchResponse.data.results.length === 0) {
            return prepareResponse(400, { error: 'Movie not found' })
        }
        return prepareResponse(200, searchResponse.data.results);

    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching movie data', details: error.message });
    }
}
module.exports = {
    searchMovie
}