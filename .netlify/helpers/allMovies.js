const { find } = require("../services/db");
const { DEFAULT_LIMIT, MOVIE_COLLECCTION } = require("../utils/constants");
const { prepareResponse } = require("../utils/utils");

const getInitialMovies = async () => {
    try {
        let searchResponse = await find(MOVIE_COLLECCTION, {}, null, DEFAULT_LIMIT);
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