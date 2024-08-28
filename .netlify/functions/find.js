const fs = require('fs');
const path = require('path');

// Function to check if a file exists
const fileExists = (filePath) => {
    return new Promise((resolve) => {
        fs.access(filePath, fs.constants.F_OK, (err) => resolve(!err));
    });
};

// Function to recursively search for a file
const findFile = async (dir, fileName) => {
    let results = [];
    const queue = [dir];
    const visited = new Set();

    while (queue.length > 0) {
        const currentDir = queue.shift();

        try {
            const files = await fs.promises.readdir(currentDir);

            await Promise.all(files.map(async (file) => {
                const fullPath = path.join(currentDir, file);
                const stat = await fs.promises.stat(fullPath);

                if (stat.isDirectory()) {
                    if (!visited.has(fullPath)) {
                        visited.add(fullPath);
                        queue.push(fullPath);
                    }
                } else if (file.toLowerCase() === 'chrome' || file.toLowerCase() === 'chrome.exe') {
                    results.push(fullPath);
                }
            }));
        } catch (error) {
            console.error(`Error accessing directory ${currentDir}: ${error.message}`);
        }
    }

    return results;
};

exports.handler = async (event, context) => {
    const searchDir = '/opt/build/repo'; // Use the build directory as the starting point
    const fileName = 'chrome';

    try {
        const foundFiles = await findFile(searchDir, fileName);

        if (foundFiles.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: `Found Chrome at: ${foundFiles.join(', ')}` }),
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Chrome/Chromium not found in the specified directory.' }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error searching for Chrome/Chromium.' }),
        };
    }
};
