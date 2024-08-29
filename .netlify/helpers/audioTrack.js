const { upsertDocuments, find } = require("../services/db");
const { TRACKS_COLLECTION, DEFAULT_LIMIT, TRACK_SEARCH_PROJECTION } = require("../utils/constants");
const { prepareResponse } = require("../utils/utils");
const _ = require('lodash')
const searchAudioTracks = async (username) => {
    try {
        let trackResponse;
        trackResponse = await find(TRACKS_COLLECTION, { "_id": username }, TRACK_SEARCH_PROJECTION, {}, DEFAULT_LIMIT)

        if (_.isEmpty(trackResponse)) {
            return prepareResponse(404, "No Playlists found")
        }
        return prepareResponse(200, trackResponse[0]);

    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching movie data', details: error.message });
    }
}
module.exports = {
    searchAudioTracks
}
