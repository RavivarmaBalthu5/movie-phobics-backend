const { getInitialMovies } = require('../helpers/allMovies');
const { searchFullMovie } = require('../helpers/fullMovie');
const { searchMovie } = require('../helpers/searchMovie');
const { fetchTrailer } = require('../helpers/trailer');
const { closeMongoClient } = require('../services/db');
const { prepareResponse } = require('../utils/utils');

exports.handler = async (event, context) => {
  const movieName = event.queryStringParameters.movie;
  const allMovies = event.queryStringParameters.allmovies;
  const trailerMovieId = event.queryStringParameters.trailer; //from UI we get movieId for trailer
  const movieVideoName = event.queryStringParameters.fullmovie;

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
    if (movieVideoName) {
      return await searchFullMovie(movieVideoName)
    }
  } catch (e) {
    return prepareResponse(500, e.message)
  }
};
