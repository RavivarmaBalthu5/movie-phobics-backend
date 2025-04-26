const { hash, compare } = require("bcryptjs");

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
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify(body)
    };
};


exports.getHasedPassword = async (password) => {
    return await hash(password, 10);
}
exports.comparePassword = async (password, userPassword) => {
    return await compare(password, userPassword)
}