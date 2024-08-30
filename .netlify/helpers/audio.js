const { isEmpty } = require("lodash");
const { find, upsertDocuments } = require("../services/db");
const { TRACKS_COLLECTION, DEFAULT_LIMIT, TRACK_SEARCH_PROJECTION } = require("../utils/constants");
const { prepareResponse } = require("../utils/utils");
const getAudioTracks = async (username) => {
    try {
        let tracksResponse = await find(TRACKS_COLLECTION, { "_id": username }, TRACK_SEARCH_PROJECTION, {}, DEFAULT_LIMIT)

        if (isEmpty(tracksResponse[0].tracks)) {
            return prepareResponse(404, "No Tracks found")
        }
        return prepareResponse(200, tracksResponse[0].tracks);

    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching tracks', details: error.message });
    }
}

const updateTrackIdInDB = async (trackId, username) => {
    try {
        const newTrackObj = { "_id": username, "tracks": [{ "id": trackId }] };
        const tracksResponse = await find(TRACKS_COLLECTION, { "_id": username }, TRACK_SEARCH_PROJECTION, {}, DEFAULT_LIMIT) || [];

        if (tracksResponse.length === 0) {
            console.log("No Tracks found for that user, so adding tracks");
            await upsertDocuments(TRACKS_COLLECTION, [newTrackObj], "_id");
            return prepareResponse(200, newTrackObj.tracks);
        }
        const userTracks = tracksResponse[0].tracks;
        if (userTracks.some(track => track.id === trackId)) {
            console.log("Track already present, so skipping updating");
            return prepareResponse(200, userTracks);
        }

        userTracks.push(newTrackObj.tracks[0]);
        tracksResponse[0].tracks = userTracks;
        tracksResponse[0]._id = username

        await upsertDocuments(TRACKS_COLLECTION, tracksResponse, "_id");
        return prepareResponse(200, userTracks);

    } catch (error) {
        return prepareResponse(500, { error: 'Error fetching tracks', details: error.message });
    }
};

module.exports = {
    getAudioTracks,
    updateTrackIdInDB
}
