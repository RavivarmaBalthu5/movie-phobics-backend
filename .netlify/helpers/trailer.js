const { isEmpty } = require("lodash");
const { find, upsertDocuments } = require("../services/db");
const { BASE_URL, TMDB_API_ID, API_COLLECTION, DEFAULT_LIMIT, TRAILERS_COLLECCTION } = require("../utils/constants");
const { prepareResponse } = require("../utils/utils");
const axios = require('axios');

const fetchTrailer = async (movieId) => {
    try {
        let searchResponse;
        const TMDB_API_KEY = await find(API_COLLECTION, { "_id": TMDB_API_ID }, null, DEFAULT_LIMIT)
        if (!TMDB_API_KEY) {
            return prepareResponse(500, { error: 'TMDB API key is not set' });
        }
        // Search for the movie to get the ID
        searchResponse = await find(TRAILERS_COLLECCTION, { "movieId": movieId }, null, DEFAULT_LIMIT)
        // Search for the movie video data
        if (isEmpty(searchResponse)) {
            const response = await axios.get(`${BASE_URL}movie/${movieId}/videos?api_key=${TMDB_API_KEY[0]?.api_key}`);
            searchResponse = response?.data;
            if (!isEmpty(searchResponse)) {
                await upsertDocuments(TRAILERS_COLLECCTION, searchResponse, 'movieId')
            }
        }
        if (searchResponse === 0) {
            return prepareResponse(400, { error: 'Movie videos not found' })
        }
        return prepareResponse(200, searchResponse.results);

    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching movie videos', details: error.message });
    }
};

module.exports = {
    fetchTrailer
}
