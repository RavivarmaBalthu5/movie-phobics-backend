const { find, upsertDocuments } = require("../services/db");
const { BASE_URL, DEFAULT_LIMIT, MOVIE_COLLECTION, SEARCH_MOVIE_SORT_ORDER, SEARCH_MOVIE_PROJECTIONS } = require("../utils/constants");
const { prepareResponse } = require("../utils/utils");
const axios = require('axios');
const _ = require('lodash')
const API_KEY = process.env.TMDB_API_KEY;
const searchMovie = async (movieName) => {
    try {
        let searchResponse;
        // Search for the movie to get the ID
        searchResponse = await find(MOVIE_COLLECTION, { "title": new RegExp(movieName, 'i') }, SEARCH_MOVIE_PROJECTIONS, SEARCH_MOVIE_SORT_ORDER, DEFAULT_LIMIT)
        if (_.isEmpty(searchResponse)) {
            let response = await axios.get(`${BASE_URL}search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}`);

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
