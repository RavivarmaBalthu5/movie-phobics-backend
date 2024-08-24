const { getTMDBApiKey } = require("../services/apiService");
const { find, upsertDocuments } = require("../services/db");
const { BASE_URL, DEFAULT_LIMIT, MOVIE_COLLECCTION } = require("../utils/constants");
const { prepareResponse } = require("../utils/utils");
const axios = require('axios');
const _ = require('lodash')

const searchMovie = async (movieName) => {
    try {
        let searchResponse;
        const TMDB_API_KEY = await getTMDBApiKey()
        // Search for the movie to get the ID
        console.log(`TMDB_API_KEY: ${JSON.stringify(TMDB_API_KEY)}`);

        searchResponse = await find(MOVIE_COLLECCTION, { "title": new RegExp(movieName, 'i') }, null, DEFAULT_LIMIT)
        console.log(`searchResponse: ${JSON.stringify(searchResponse)}`);
        if (_.isEmpty(searchResponse)) {
            let response = await axios.get(`${BASE_URL}search/movie?api_key=${TMDB_API_KEY[0]?.api_key}&query=${encodeURIComponent(movieName)}`);
            searchResponse = response?.data.results;
            console.log(`searchResponse2: ${JSON.stringify(searchResponse)}`);
            await upsertDocuments(MOVIE_COLLECCTION, searchResponse, 'id')
        }
        if (_.isEmpty(searchResponse)) {
            return prepareResponse(400, { error: 'Movie not found' })
        }
        console.log(`searchResponse3: ${JSON.stringify(searchResponse)}`);
        return prepareResponse(200, searchResponse);

    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching movie data', details: error.message });
    }
}
module.exports = {
    searchMovie
}