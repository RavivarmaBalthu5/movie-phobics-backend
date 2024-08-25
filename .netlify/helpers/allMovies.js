const { find, aggregate } = require("../services/db");
const { DEFAULT_LIMIT, MOVIE_COLLECTION, ALL_MOVIES_SORT_ORDER, ALL_MOVIES_PROJECTIONS } = require("../utils/constants");
const { prepareResponse } = require("../utils/utils");

const getInitialMovies = async () => {
    try {
       

       // let searchResponse = await aggregate(MOVIE_COLLECTION, pipeline);
        let  searchResponse =  await find(MOVIE_COLLECTION, {}, ALL_MOVIES_PROJECTIONS, ALL_MOVIES_SORT_ORDER, DEFAULT_LIMIT);
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
