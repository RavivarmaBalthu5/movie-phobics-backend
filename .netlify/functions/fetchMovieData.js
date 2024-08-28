const { getInitialMovies } = require('../helpers/allMovies');
const { searchAudioTracks } = require('../helpers/audioTrack');
const { searchMovie } = require('../helpers/searchMovie');
const { fetchTrailer } = require('../helpers/trailer');
const { prepareResponse } = require('../utils/utils');

exports.handler = async (event, context) => {
  const movieName = event.queryStringParameters.movie;
  const allMovies = event.queryStringParameters.allmovies;
  const trailerMovieId = event.queryStringParameters.trailer; //from UI we get movieId for trailer
  const trackName = event.queryStringParameters.track;

  try {
    if (allMovies) {
      return await getInitialMovies()
    }
    if (movieName) {
      return await searchMovie(movieName)
    }
    if (trailerMovieId) {
      return await fetchTrailer(trailerMovieId);
    }
    if (trackName) {
      return await searchAudioTracks(trackName);
    }
    return prepareResponse(400, 'Missing query parameter');
  } catch (e) {
    return prepareResponse(500, e.message)
  }
};
