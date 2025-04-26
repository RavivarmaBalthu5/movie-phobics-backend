const { createUser, getUser } = require('../services/db');
const { getHasedPassword, comparePassword } = require('../utils/utils');



exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    try {
        const body = JSON.parse(event.body);

        const { type, name, email, password } = body;

        if (!type || !email || !password || (type === 'signup' && !name)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields' }),
            };
        }

        if (type === 'signup') {
            const existingUser = await getUser(email);
            if (existingUser) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'User already exists' }),
                };
            }

            const hashedPassword = await getHasedPassword(password);

            await createUser({
                name,
                email,
                password: hashedPassword,
            });

            return {
                statusCode: 201,
                body: JSON.stringify({ message: 'SignedUp successfully' }),
            };
        }

        if (type === 'login') {
            const user = await getUser(email);

            if (!user) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: 'Invalid email or password' }),
                };
            }

            const isMatch = await comparePassword(password, user.password);
            if (!isMatch) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: 'Invalid email or password' }),
                };
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Login successful' }),
            };
        }

        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid action type' }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
        };
    }
}
