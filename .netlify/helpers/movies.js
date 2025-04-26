const { DEFAULT_LIMIT, MOVIE_COLLECTION, SEARCH_MOVIE_PROJECTIONS, SEARCH_MOVIE_SORT_ORDER, BASE_URL } = require("../utils/constants");
const { prepareResponse } = require("../utils/utils");
const { isEmpty, uniqBy } = require("lodash");
const { find, upsertDocuments } = require("../services/db");
const axios = require('axios');
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const API_KEY = process.env.TMDB_API_KEY;

const getTotalPagesCount = async (origin) => {
    try {
        const cacheKey = `totalPagesCount`
        const cachedData = myCache.get(cacheKey);
        if (cachedData) {
            return prepareResponse(200, (cachedData) / 5, origin)
        }
        let response = await axios.get(`${BASE_URL}movie/now_playing?api_key=${API_KEY}&language=en-US`);
        myCache.set(cacheKey, response?.data?.total_pages, 3600);
        return prepareResponse(200, (response?.data?.total_pages) / 5, origin);
    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching Total Pages', details: error.message }, origin);
    }
}

const getCurrentPageMovies = async (currentPage, origin) => {
    try {
        const cacheKey = currentPage
        const cachedData = myCache.get(cacheKey);
        if (cachedData) {
            return prepareResponse(200, cachedData, origin);
        }
        let searchResponse = [];
        const startingPage = (currentPage - 1) * 5 + 1;

        for (let page = startingPage; page < startingPage + 5; page++) {
            let response = await axios.get(`${BASE_URL}movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`);
            if (!response?.data?.results || response.data.results.length === 0) {
                break;
            }
            searchResponse.push(...response.data.results);
        }
        const uniqueMovies = uniqBy(searchResponse, 'id');
        await upsertDocuments(MOVIE_COLLECTION, uniqueMovies, 'id');
        myCache.set(cacheKey, uniqueMovies, 3600);
        return prepareResponse(200, uniqueMovies, origin);
    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching current page movies', details: error.message }, origin);
    }
};


const searchMovie = async (movieName, origin) => {
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
            return prepareResponse(400, { error: 'Movie not found' }, origin)
        }
        return prepareResponse(200, searchResponse, origin);

    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching movie data', details: error.message }, origin);
    }
}

const fetchTrailer = async (movieIdString, origin) => {
    try {
        const cacheKey = `trailers:${movieIdString}`;
        const cachedData = myCache.get(cacheKey);
        if (cachedData) {
            return prepareResponse(200, cachedData, origin);
        }
        const movieId = parseInt(movieIdString, 10);
        const response = await axios.get(`${BASE_URL}movie/${movieId}/videos?api_key=${API_KEY}`);
        if (isEmpty(response?.data.results)) {
            return prepareResponse(400, { error: 'Movie videos not found' }, origin)
        }
        myCache.set(cacheKey, response?.data.results, 300);
        return prepareResponse(200, response?.data.results, origin);

    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching movie videos', details: error.message }, origin);
    }
};

const fetchMovieDetails = async (movieIdString, origin) => {
    try {
        const cacheKey = `movieDetails:${movieIdString}`;
        const cachedData = myCache.get(cacheKey);
        if (cachedData) {
            return prepareResponse(200, cachedData, origin);
        }
        const movieId = parseInt(movieIdString, 10);
        // Search for the movie
        const response = await find(MOVIE_COLLECTION, { "id": movieId }, null, SEARCH_MOVIE_SORT_ORDER, 1);
        if (isEmpty(response)) {
            return prepareResponse(400, { error: 'Movie not found' }, origin)
        }
        myCache.set(cacheKey, response, 300);
        return prepareResponse(200, response, origin);

    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching movie details', details: error.message }, origin);
    }
};

module.exports = {
    fetchTrailer,
    searchMovie,
    getCurrentPageMovies,
    getTotalPagesCount,
    fetchMovieDetails
}
