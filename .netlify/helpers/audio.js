const { isEmpty, isEqual } = require("lodash");
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

const updateTrackIdInDB = async (trackId, username, updateTrackTitle) => {
    try {
        const newTrackObj = { "_id": username, "tracks": [{ "id": trackId, "title": updateTrackTitle }] };
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

const deleteTrackIdInDB = async (username, trackId) => {
    try {
        const tracksResponse = await find(TRACKS_COLLECTION, { "_id": username }, TRACK_SEARCH_PROJECTION, {}, DEFAULT_LIMIT);
        if (!tracksResponse || tracksResponse.length === 0) {
            return prepareResponse(404, { error: 'User not found or no tracks available' });
        }
        const userTracks = tracksResponse[0].tracks;
        const trackIndex = userTracks.findIndex(track => track.id === trackId);
        if (trackIndex === -1) {
            return prepareResponse(404, { error: 'Track not found' });
        }
        userTracks.splice(trackIndex, 1);
        tracksResponse[0].tracks = userTracks;
        await upsertDocuments(TRACKS_COLLECTION, tracksResponse, "_id");
        return prepareResponse(200, tracksResponse[0].tracks);

    } catch (error) {
        return prepareResponse(500, { error: 'Error deleting track', details: error.message });
    }
};


module.exports = {
    getAudioTracks,
    updateTrackIdInDB,
    deleteTrackIdInDB
}
