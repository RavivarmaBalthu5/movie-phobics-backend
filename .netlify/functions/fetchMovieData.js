const { getAudioTracks, updateTrackIdInDB, deleteTrackIdInDB } = require("../helpers/audio");
const { getInitialMovies, searchMovie, fetchTrailer } = require("../helpers/movies");
const { prepareResponse } = require("../utils/utils");


exports.handler = async (event, context) => {
  const movieName = event.queryStringParameters.movie;
  const allMovies = event.queryStringParameters.allmovies;
  const trailerMovieId = event.queryStringParameters.trailer; //from UI we get movieId for trailer
  const username = event.queryStringParameters.username;
  const updateTrackId = event.queryStringParameters.updateTrackId;
  const updateTrackTitle = event.queryStringParameters.updateTrackTitle;
  const deleteTrackId = event.queryStringParameters.deleteTrackId


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
    if (username && !updateTrackId && !updateTrackTitle && !deleteTrackId) {
      return await getAudioTracks(username);
    }
    if (updateTrackId && username && updateTrackTitle) {
      return await updateTrackIdInDB(updateTrackId, username, updateTrackTitle)
    }
    if (deleteTrackId && username) {
      return await deleteTrackIdInDB(username, deleteTrackId)
    }
    return prepareResponse(400, 'Missing query parameter');
  } catch (e) {
    return prepareResponse(500, e.message)
  }
};
