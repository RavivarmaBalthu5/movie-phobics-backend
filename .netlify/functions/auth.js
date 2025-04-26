const { createUser, getUser } = require('../services/db');
const { getHasedPassword, comparePassword, prepareResponse } = require('../utils/utils');



exports.handler = async (event, context) => {
    const origin = event.headers.origin;

    if (event.httpMethod === 'OPTIONS') {
        return prepareResponse(200, {}, origin);
    }

    if (event.httpMethod !== 'POST') {
        return prepareResponse(405, 'Method Not Allowed', origin);
    }

    try {
        const body = JSON.parse(event.body);
        const { type, name, email, password } = body;

        if (!type || !email || !password || (type === 'signup' && !name)) {
            return prepareResponse(400, 'Missing required fields', origin);
        }

        if (type === 'signup') {
            const existingUser = await getUser(email);
            if (existingUser) {
                return prepareResponse(400, 'User already exists', origin);
            }

            const hashedPassword = await getHasedPassword(password);
            let user = await createUser({ name, email, password: hashedPassword });

            return prepareResponse(200, user, origin);
        }

        if (type === 'login') {
            const user = await getUser(email);
            if (!user) {
                return prepareResponse(401, 'Invalid email address, Please try again', origin);
            }

            const isMatch = await comparePassword(password, user.password);
            if (!isMatch) {
                return prepareResponse(401, 'Invalid Password, Please try again', origin);
            }
            delete user?.password
            return prepareResponse(200, user, origin);
        }

        return prepareResponse(400, 'Invalid action type', origin);
    } catch (error) {
        return prepareResponse(500, {
            message: 'Internal Server Error',
            error: error.message
        }, origin);
    }
};
