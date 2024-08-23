const { BASE_URL, TMDB_API_KEY } = require("../utils/constants");
const { prepareResponse } = require("../utils/utils");

const searchMovie = async (movieName) => {
    if (!TMDB_API_KEY) {
        return prepareResponse(500, { error: 'TMDB API key is not set' });
    }

    try {
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