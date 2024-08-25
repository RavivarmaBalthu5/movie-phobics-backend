const { getSpotifyToken } = require("../services/apiService");
const { upsertDocuments, find } = require("../services/db");
const { TRACKS_COLLECTION, DEFAULT_LIMIT, SPOTIFY_SEARCH_URL, TRACK_SEARCH_PROJECTION } = require("../utils/constants");
const { prepareResponse } = require("../utils/utils");
const axios = require('axios');
const _ = require('lodash')
const querystring = require('querystring');
const searchAudioTracks = async (track) => {
    try {
        let trackResponse;
        trackResponse = await find(TRACKS_COLLECTION, { "name": new RegExp(track, 'i') }, TRACK_SEARCH_PROJECTION, {}, DEFAULT_LIMIT)

        if (_.isEmpty(trackResponse)) {
            const token = await getSpotifyToken()
            trackResponse = await axios.get(SPOTIFY_SEARCH_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                params: {
                    q: track,
                    type: 'track',
                    limit: 10, // Number of results to return
                },
                paramsSerializer: params => querystring.stringify(params),
            });
            trackResponse = trackResponse.data.tracks.items
            await upsertDocuments(TRACKS_COLLECTION, trackResponse, 'id')
        }
        return prepareResponse(200, trackResponse);

    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching movie data', details: error.message });
    }
}
module.exports = {
    searchAudioTracks
}
