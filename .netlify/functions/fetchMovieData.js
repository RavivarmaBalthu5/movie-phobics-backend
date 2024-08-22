const axios = require('axios');

exports.handler = async (event, context) => {
  const movieName = event.queryStringParameters.movie;
  const allMovies = event.queryStringParameters.allmovies;

  if (!movieName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Movie name is required' })
    };
  }

  const TMDB_API_KEY = '2fb9673c2de3d5f1fb9f998dddbf34d7';

  if (!TMDB_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'TMDB API key is not set' })
    };
  }
  const BASE_URL = `https://api.themoviedb.org/3/`

  try {
    // Search for the movie to get the ID
    const searchUrl = allMovies ? `${BASE_URL}movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1` : `${BASE_URL}search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movieName)}`;
    const searchResponse = await axios.get(searchUrl);

    if (searchResponse.data.results.length === 0) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Allow all origins
          'Access-Control-Allow-Methods': 'GET, OPTIONS', // Allow GET and OPTIONS methods
        },
        body: JSON.stringify({ error: 'Movie not found' })
      };
    }

    const movieId = searchResponse.data.results[0].id;

    // Fetch movie details
    const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=watch/providers,images`;
    const detailsResponse = await axios.get(detailsUrl);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins
        'Access-Control-Allow-Methods': 'GET, OPTIONS', // Allow GET and OPTIONS methods
      },
      body: JSON.stringify({
        title: detailsResponse.data.title,
        year: detailsResponse.data.release_date.split('-')[0],
        overview: detailsResponse.data.overview,
        release_date: detailsResponse.data.release_date,
        image: detailsResponse.data.images?.posters[0]?.file_path
          ? `https://image.tmdb.org/t/p/original${detailsResponse.data.images.posters[0].file_path}`
          : 'No image available',
        streaming_providers: detailsResponse.data['watch/providers']?.results || 'No streaming data available'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins
        'Access-Control-Allow-Methods': 'GET, OPTIONS', // Allow GET and OPTIONS methods
      },
      body: JSON.stringify({ error: 'Error fetching movie data', details: error.message })
    };
  }
};
