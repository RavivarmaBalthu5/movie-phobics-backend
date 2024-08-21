// fetchMovieData.js
const axios = require('axios');

exports.handler = async (event, context) => {
  // Replace with your Trakt API client ID
  const clientId = 'fdb249036f1e814f0d12e45b3df49b36614e06d6f08229147f23c440a57e448b';
  const movieName = event.queryStringParameters.name;

  if (!movieName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Movie name is required' })
    };
  }

  try {
    // Search for the movie
    const searchResponse = await axios.get(`https://api.trakt.tv/search/movie`, {
      params: { query: movieName },
      headers: {
        'Authorization': `Bearer 0ef0c00331f45233c4fddd2c8cfc9dcee0a4e16b56f272c2cc57d245e1f02002`,
        'Content-Type': 'application/json',
        'trakt-api-key': clientId
      }
    });

    if (searchResponse.data.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Movie not found' })
      };
    }

    const movieId = searchResponse.data[0].ids.trakt;

    // Fetch movie details including streaming info
    const movieResponse = await axios.get(`https://api.trakt.tv/movies/${movieId}`, {
      headers: {
        'Authorization': `Bearer 0ef0c00331f45233c4fddd2c8cfc9dcee0a4e16b56f272c2cc57d245e1f02002`,
        'Content-Type': 'application/json',
        'trakt-api-key': clientId
      }
    });

    const movieDetails = movieResponse.data;

    // Assuming streaming provider info is available in the `watching` field (adjust as necessary)
    const streamingProviders = movieDetails.streaming || [];
    
    // Format streaming providers
    const providersList = streamingProviders.map(provider => ({
      name: provider.provider,
      country: provider.country
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        title: movieDetails.title,
        overview: movieDetails.overview,
        streamingProviders: providersList
      })
    };
  } catch (error) {
    console.error('Error fetching movie data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching movie data' })
    };
  }
};
