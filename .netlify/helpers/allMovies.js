const { find } = require("../services/db");
const { DEFAULT_LIMIT, MOVIE_COLLECTION } = require("../utils/constants");
const { prepareResponse } = require("../utils/utils");

const getInitialMovies = async () => {
    try {
        let searchResponse = await find(MOVIE_COLLECTION, {}, { "title": 1,"overview" : 1, "poster_path": 1, "id": 1, "release_date": 1 }, DEFAULT_LIMIT);
        if (searchResponse === 0) {
            return prepareResponse(400, { error: 'Movies not found' })
        }
        return prepareResponse(200, searchResponse);
    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching initial movie data', details: error.message });
    }
}
module.exports = {
    getInitialMovies
}
