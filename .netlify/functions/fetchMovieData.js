const { getAudioTracks, updateTrackIdInDB } = require("../helpers/audio");
const { getInitialMovies, searchMovie, fetchTrailer } = require("../helpers/movies");
const { prepareResponse } = require("../utils/utils");


exports.handler = async (event, context) => {
  const movieName = event.queryStringParameters.movie;
  const allMovies = event.queryStringParameters.allmovies;
  const trailerMovieId = event.queryStringParameters.trailer; //from UI we get movieId for trailer
  const username = event.queryStringParameters.username;
  const updateTrackId = event.queryStringParameters.updateTrackId;


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
    if (username && !updateTrackId) {
      return await getAudioTracks(username);
    }
    if (updateTrackId && username) {
      return await updateTrackIdInDB(updateTrackId, username)
    }
    return prepareResponse(400, 'Missing query parameter');
  } catch (e) {
    return prepareResponse(500, e.message)
  }
};
