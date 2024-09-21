const { DEFAULT_LIMIT, MOVIE_COLLECTION, SEARCH_MOVIE_PROJECTIONS, SEARCH_MOVIE_SORT_ORDER, BASE_URL, TRAILERS_COLLECTION, TRAILERS_PROJECTIONS, TRAILERS_SORT_ORDER } = require("../utils/constants");
const { prepareResponse } = require("../utils/utils");
const { isEmpty } = require("lodash");
const { find, upsertDocuments } = require("../services/db");
const axios = require('axios');
const API_KEY = process.env.TMDB_API_KEY;

const getTotalPagesCount = async () => {
    try {
        let response = await axios.get(`${BASE_URL}movie/now_playing?api_key=${API_KEY}&language=en-US`);
        return prepareResponse(200, response?.data?.total_pages);
    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching Total Pages', details: error.message });
    }
}

const getCurrentPageMovies = async (currentPage) => {
    try {
        let response = await axios.get(`${BASE_URL}movie/now_playing?api_key=${API_KEY}&language=en-US&page=${currentPage}`);
        searchResponse = response?.data?.results;
        await upsertDocuments(MOVIE_COLLECTION, searchResponse, 'id')
        return prepareResponse(200, searchResponse);
    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching current page movies', details: error.message });
    }
}

const searchMovie = async (movieName) => {
    try {
        let searchResponse;
        // Search for the movie to get the ID
        searchResponse = await find(MOVIE_COLLECTION, { "title": new RegExp(movieName, 'i') }, SEARCH_MOVIE_PROJECTIONS, SEARCH_MOVIE_SORT_ORDER, DEFAULT_LIMIT)
        if (isEmpty(searchResponse)) {
            let response = await axios.get(`${BASE_URL}search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}`);

            searchResponse = response?.data.results;
            await upsertDocuments(MOVIE_COLLECTION, searchResponse, 'id')
        }
        if (isEmpty(searchResponse)) {
            return prepareResponse(400, { error: 'Movie not found' })
        }
        return prepareResponse(200, searchResponse);

    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching movie data', details: error.message });
    }
}

const fetchTrailer = async (movieIdString) => {
    try {
        let searchResponse = [];
        const movieId = parseInt(movieIdString, 10);
        // Search for the movie to get the ID
        searchResponse = await find(TRAILERS_COLLECTION, { "movieId": movieId }, TRAILERS_PROJECTIONS, TRAILERS_SORT_ORDER, DEFAULT_LIMIT)
        if (isEmpty(searchResponse)) {
            const response = await axios.get(`${BASE_URL}movie/${movieId}/videos?api_key=${API_KEY}`);
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
    fetchTrailer,
    searchMovie,
    getCurrentPageMovies,
    getTotalPagesCount
}
