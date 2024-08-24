const { find } = require("../services/db");
const { BASE_URL, TMDB_API_ID, API_COLLECTION, DEFAULT_LIMIT } = require("../utils/constants");
const { prepareResponse } = require("../utils/utils");
const axios = require('axios');

const fetchTrailer = async (movieId) => {
    try {
        const TMDB_API_KEY = await find(API_COLLECTION, { "_id": TMDB_API_ID }, null, DEFAULT_LIMIT)
        if (!TMDB_API_KEY) {
            return prepareResponse(500, { error: 'TMDB API key is not set' });
        }
        // Search for the movie video data
        const response = await axios.get(`${BASE_URL}movie/${movieId}/videos?api_key=${TMDB_API_KEY[0]?.api_key}`);

        if (response.data.results.length === 0) {
            return prepareResponse(400, { error: 'Movie videos not found' })
        }
        return prepareResponse(200, response.data.results);

    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching movie videos', details: error.message });
    }
};

module.exports = {
    fetchTrailer
}
