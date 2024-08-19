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
