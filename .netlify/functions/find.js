const fs = require('fs');
const path = require('path');

// Function to check if a file exists
const fileExists = (filePath) => {
    return new Promise((resolve) => {
        fs.access(filePath, fs.constants.F_OK, (err) => resolve(!err));
    });
};

// Possible paths to check for Chrome/Chromium
const possiblePaths = [
    '/bin/google-chrome',
    '/bin/chromium-browser',
    '/bin/chromium',
    '/google/chrome/chrome',
    '/chrome/chrome',
    '/local/bin/chrome',
    '/local/bin/chromium'
];

exports.handler = async function (event, context) {
    let foundPath = 'Chrome/Chromium not found in common paths.';

    for (const p of possiblePaths) {
        if (await fileExists(p)) {
            foundPath = `Found Chrome/Chromium at: ${p}`;
            break;
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: foundPath }),
    };
};
