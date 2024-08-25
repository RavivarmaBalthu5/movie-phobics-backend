const { getGoogleApiKey } = require("../services/apiService");
const { searchMovieVideos } = require("../services/googleApiService");
const { prepareResponse } = require("../utils/utils");
const _ = require('lodash')

const searchFullMovie = async (movieName) => {
    try {
        const GOOGLE_YOUTUBE_API_KEY = await getGoogleApiKey()
        let searchResponse = await searchMovieVideos(movieName, GOOGLE_YOUTUBE_API_KEY)
        if (_.isEmpty(searchResponse)) {
            return prepareResponse(404, { error: 'Full Movie not found' })
        }
        return prepareResponse(200, searchResponse);

    } catch (error) {
        return prepareResponse(500, { error: 'Error searching full movie data', details: error.message });
    }
}
module.exports = {
    searchFullMovie
}
