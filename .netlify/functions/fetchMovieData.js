const { getAudioTracks, updateTrackIdInDB, deleteTrackIdInDB } = require("../helpers/audio");
const { searchMovie, fetchTrailer, getTotalPagesCount, getCurrentPageMovies } = require("../helpers/movies");
const { prepareResponse } = require("../utils/utils");


exports.handler = async (event, context) => {
  const totalPages = event.queryStringParameters.now_playing_total_pages
  const movieName = event.queryStringParameters.movie;
  const nowPlayingCurrentPage = event.queryStringParameters.now_playing_current_page;
  const trailerMovieId = event.queryStringParameters.trailer; //from UI we get movieId for trailer
  const username = event.queryStringParameters.username;
  const updateTrackId = event.queryStringParameters.updateTrackId;
  const updateTrackTitle = event.queryStringParameters.updateTrackTitle;
  const deleteTrackId = event.queryStringParameters.deleteTrackId


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
