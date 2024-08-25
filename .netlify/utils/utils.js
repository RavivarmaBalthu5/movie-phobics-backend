exports.prepareProjections = (projectionArray) => {
    const isValidKey = (key) => /^[a-zA-Z0-9.]+$/.test(key); // Only alphanumeric characters are allowed

    const projectionObj = projectionArray.reduce((acc, key) => {
        if (isValidKey(key)) {
            acc["_id"] = 0;
            acc[key] = 1;
        } else {
            console.warn(`Invalid projection "${key}" passed and skipped this.`);
        }
        return acc;
    }, {});

    return projectionObj;
}

exports.prepareResponse = (statusCode, body) => {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Allow all origins
            'Access-Control-Allow-Methods': 'GET, OPTIONS', // Allow GET and OPTIONS methods
        },
        body: JSON.stringify(body)
    };
}

// Function to convert ISO 8601 duration to minutes
exports.durationToMinutes = (duration) => {
    const regex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    const match = duration.match(regex);
    if (!match) return 0;
    const hours = parseInt(match[1] || 0, 10);
    const minutes = parseInt(match[2] || 0, 10);
    return (hours * 60) + minutes;
};

exports.mergeMovieVideoData = (searchListResponse, videoListResponse) => {
    const videoDetailsMap = new Map();
    videoListResponse.forEach(video => {
        const { kind, ...rest } = video; //remove top-level kind field from video response
        videoDetailsMap.set(rest.id, rest);
    });

    // Enrich searchListResponse items with video details
    const enrichedItems = searchListResponse.map(item => {
        const videoId = item.id.videoId;
        const videoDetails = videoDetailsMap.get(videoId) || {};
        const { kind, ...searchItemRest } = item;
        const { kind: idKind, ...idRest } = searchItemRest.id;
        return {
            ...idRest,
            _id: videoId,
            details: videoDetails
        };
    });
    return enrichedItems
}

exports.getMissingVideoIdsAndData = (videoData, existingData) => {
    // Map existing IDs for quick lookup
    const existingVideoIds = new Set(existingData.map(video => video._id.toString())); // Assuming _id is an ObjectId

    // Separate video IDs and data into missing items
    const missingVideoData = [];
    const missingVideoIds = [];

    videoData.forEach(item => {
        const videoId = item.id.videoId; // Adjust to match the structure of your videoData

        if (!existingVideoIds.has(videoId)) {
            missingVideoIds.push(videoId);
            missingVideoData.push(item);
        }
    });
    // Return as comma-separated string and array of missing data
    return {
        missingVideoIds: missingVideoIds.join(','), // Comma-separated string of missing video IDs
        missingVideoData // Array of objects for missing video data
    };
};



