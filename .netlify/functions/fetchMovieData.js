const { searchMovie, fetchTrailer, getTotalPagesCount, getCurrentPageMovies, fetchMovieDetails } = require("../helpers/movies");
const { prepareResponse } = require("../utils/utils");


exports.handler = async (event, context) => {
  const totalPages = event.queryStringParameters.now_playing_total_pages
  const movieName = event.queryStringParameters.movie;
  const nowPlayingCurrentPage = event.queryStringParameters.now_playing_current_page;
  const trailerMovieId = event.queryStringParameters.trailer; //from UI we get movieId for trailer
  const movieId = event.queryStringParameters.movieId;

  try {
    if (totalPages) {
      return await getTotalPagesCount();
    }
    if (nowPlayingCurrentPage) {
      return await getCurrentPageMovies(nowPlayingCurrentPage)
    }
    if (movieName) {
      return await searchMovie(movieName)
    }
    if (trailerMovieId) {
      return await fetchTrailer(trailerMovieId);
    }
    if (movieId) {
      return await fetchMovieDetails(movieId);
    }
    return prepareResponse(400, 'Missing query parameter');
  } catch (e) {
    return prepareResponse(500, e.message)
  }
};
