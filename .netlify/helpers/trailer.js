const { BASE_URL, TMDB_API_KEY } = require("../utils/constants");
const { prepareResponse } = require("../utils/utils");
const axios = require('axios');

const fetchTrailer = async (movieId) => {
    if (!TMDB_API_KEY) {
        return prepareResponse(500, { error: 'TMDB API key is not set' });
    }
    try {
        // Search for the movie video data
        const response = await axios.get(`${BASE_URL}movie/${movieId}/videos?api_key=${TMDB_API_KEY}`);

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
