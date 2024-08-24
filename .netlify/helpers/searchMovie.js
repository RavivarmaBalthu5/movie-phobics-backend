const { find, upsertDocuments } = require("../services/db");
const { BASE_URL, API_COLLECTION, TMDB_API_ID, DEFAULT_LIMIT, MOVIE_COLLECCTION } = require("../utils/constants");
const { prepareResponse } = require("../utils/utils");
const axios = require('axios');
const _ = require('lodash')

const searchMovie = async (movieName) => {
    try {
        let searchResponse;
        const TMDB_API_KEY = await find(API_COLLECTION, { "_id": TMDB_API_ID }, null, DEFAULT_LIMIT)
        if (!TMDB_API_KEY) {
            return prepareResponse(500, { error: 'TMDB API key is not set' });
        }
        // Search for the movie to get the ID
        searchResponse = await find(MOVIE_COLLECCTION, { "title": new RegExp(movieName, 'i') }, null, DEFAULT_LIMIT)
        if (_.isEmpty(searchResponse)) {
            let response = await axios.get(`${BASE_URL}search/movie?api_key=${TMDB_API_KEY[0]?.api_key}&query=${encodeURIComponent(movieName)}`);
            searchResponse = response?.data.results;
            await upsertDocuments(MOVIE_COLLECCTION, searchResponse, 'id')
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