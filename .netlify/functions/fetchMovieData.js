const axios = require('axios');

const CLIENT_ID = 'fdb249036f1e814f0d12e45b3df49b36614e06d6f08229147f23c440a57e448b';
const CLIENT_SECRET = '0ef0c00331f45233c4fddd2c8cfc9dcee0a4e16b56f272c2cc57d245e1f02002';

// Function to get access token using client credentials
const getAccessToken = async () => {
  try {
    const response = await axios.post('https://trakt.tv/oauth/token', null, {
      params: {
        grant_type: 'client_credentials'
      },
      headers: {
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching access token');
  }
};

exports.handler = async (event, context) => {
  const movieName = event.queryStringParameters.name;

  if (!movieName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Movie name is required' })
    };
  }

  try {
    // Get the access token
    const accessToken = await getAccessToken();

    // Fetch movie data using the access token
    const response = await axios.get('https://api.trakt.tv/search/movie', {
      params: { query: movieName },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'trakt-api-key': CLIENT_ID
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error fetching movie data:', error.response ? error.response.data : error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching movie data' })
    };
  }
};
