const { isEmpty } = require("lodash");
const { find, upsertDocuments } = require("../services/db");
const { BASE_URL, DEFAULT_LIMIT, TRAILERS_COLLECTION, TRAILERS_PROJECTIONS, TRAILERS_SORT_ORDER } = require("../utils/constants");
const { prepareResponse } = require("../utils/utils");
const axios = require('axios');
const { getTMDBApiKey } = require("../services/apiService");

const fetchTrailer = async (movieIdString) => {
    try {
        let searchResponse = [];
        const movieId = parseInt(movieIdString, 10);
        const TMDB_API_KEY = await getTMDBApiKey();
        // Search for the movie to get the ID
        searchResponse = await find(TRAILERS_COLLECTION, { "movieId": movieId }, TRAILERS_PROJECTIONS, TRAILERS_SORT_ORDER, DEFAULT_LIMIT)
        if (isEmpty(searchResponse)) {
            const response = await axios.get(`${BASE_URL}movie/${movieId}/videos?api_key=${TMDB_API_KEY}`);
            if (!isEmpty(response.data)) {
                response.data.movieId = movieId;
                searchResponse.push(response.data)
                await upsertDocuments(TRAILERS_COLLECTION, searchResponse, 'movieId')
            }
        }

        if (searchResponse === 0) {
            return prepareResponse(400, { error: 'Movie videos not found' })
        }
        return prepareResponse(200, searchResponse[0].results);

    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching movie videos', details: error.message });
    }
};

module.exports = {
    fetchTrailer
}
