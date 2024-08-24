const { getTMDBApiKey } = require("../services/apiService");
const { find, upsertDocuments } = require("../services/db");
const { BASE_URL, DEFAULT_LIMIT, MOVIE_COLLECTION } = require("../utils/constants");
const { prepareResponse } = require("../utils/utils");
const axios = require('axios');
const _ = require('lodash')

const searchMovie = async (movieName) => {
    try {
        let searchResponse;
        const TMDB_API_KEY = await getTMDBApiKey()
        // Search for the movie to get the ID
        searchResponse = await find(MOVIE_COLLECTION, { "title": new RegExp(movieName, 'i') }, { "title": 1,"overview" : 1, "poster_path": 1, "id": 1, "release_date": 1 }, DEFAULT_LIMIT)
        if (_.isEmpty(searchResponse)) {
            let response = await axios.get(`${BASE_URL}search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movieName)}`);
            searchResponse = response?.data.results;
            await upsertDocuments(MOVIE_COLLECTION, searchResponse, 'id')
        }
        if (_.isEmpty(searchResponse)) {
            return prepareResponse(400, { error: 'Movie not found' })
        }
        return prepareResponse(200, searchResponse);

    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching movie data', details: error.message });
    }
}
module.exports = {
    searchMovie
}
