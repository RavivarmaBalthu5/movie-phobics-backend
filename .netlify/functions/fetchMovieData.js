const { getInitialMovies } = require('../helpers/allMovies');
const { searchMovie } = require('../helpers/searchMovie');
const { fetchTrailer } = require('../helpers/trailer');
const { prepareResponse } = require('../utils/utils');

exports.handler = async (event, context) => {
  const movieName = event.queryStringParameters.movie;
  const allMovies = event.queryStringParameters.allmovies;
  const trailerMovieId = event.queryStringParameters.trailer; //from UI we get movieId for trailer

  try {
    if (allMovies) {
      return await getInitialMovies()
    }
    if (movieName) {
      return await searchMovie(movieName)
    }
    if (trailerMovieId) {
      return await fetchTrailer(trailerMovieId)
    }
  } catch (e) {
    return prepareResponse(500, e.message)
  }
};
