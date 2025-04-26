const { createUser, getUser } = require('../services/db');
const { getHasedPassword, comparePassword, prepareResponse } = require('../utils/utils');



exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return prepareResponse(405, 'Method Not Allowed')
    }

    try {
        const body = JSON.parse(event.body);

        const { type, name, email, password } = body;

        if (!type || !email || !password || (type === 'signup' && !name)) {
            return prepareResponse(400, 'Missing required fields')
        }

        if (type === 'signup') {
            const existingUser = await getUser(email);
            if (existingUser) {
                return prepareResponse(400, 'User already exists')
            }

            const hashedPassword = await getHasedPassword(password);

            await createUser({
                name,
                email,
                password: hashedPassword,
            });

            return prepareResponse(200, 'SignedUp successfully')
        }

        if (type === 'login') {
            const user = await getUser(email);

            if (!user) {
                return prepareResponse(401, 'Invalid email addresss, Please try again')
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: '' }),
                };
            }

            const isMatch = await comparePassword(password, user.password);
            if (!isMatch) {
                return prepareResponse(401, 'Invalid Ppassword, Please try again')
            }

            return prepareResponse(200, 'Login successful');
        }

        return prepareResponse(400, 'Invalid action type')
    } catch (error) {
        return prepareResponse(400, { message: 'Internal Server Error', error: error.message })
    }
}
