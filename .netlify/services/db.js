const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function setMongoConnection() {
    try {
        // Connect the client to the server
        return await client.connect();
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas', err);
        throw err; // Rethrow the error to handle it in the calling function
    } finally {
        // Close the connection
        await client.close();
    }
}

async function getMovies(projections) {
    try {
        // Connect the client to the server
        let client = await setMongoConnection();
        await client.connect();
        console.log('Connected successfully to MongoDB Atlas');

        // Specify the database and collection
        const database = client.db('sample_mflix');
        const collection = database.collection('movies');

        // Query for documents
        const query = {}; // Empty query to get all documents
        const options = {
            projection: projections
        };

        const cursor = collection.find(query, options).limit(500);

        // Collect documents into an array
        const results = [];
        await cursor.forEach(doc => results.push(doc));

        return results;
    } catch (err) {
        console.error('Error retrieving data:', err);
        throw err; // Rethrow the error to handle it in the calling function
    } finally {
        // Close the connection
        await client.close();
    }
}

module.exports = { getMovies };