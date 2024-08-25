const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Ravivarma:RavivarmaMongo@movie-phobics.x3v8z.mongodb.net/?retryWrites=true&w=majority&appName=movie-phobics"

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
        await client.connect();
        return client;
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas', err);
        throw err; // Rethrow the error to handle it in the calling function
    }
}

async function find(dbCollection, query, projections = {}, sort = {}, limit = 10) {
    let mongoClient;
    try {
        mongoClient = await setMongoConnection();
        console.log('Connected successfully to MongoDB Atlas');

        // Specify the database and collection
        const database = mongoClient.db('movie_phobics');
        const collection = database.collection(dbCollection);

        // Empty query to get all documents
        const options = {
            projection: projections,
            sort: sort
        };

        const cursor = collection.find(query, options).limit(limit);

        // Collect documents into an array
        const results = [];
        await cursor.forEach(doc => results.push(doc));
        return results;
    } catch (err) {
        console.error('Error retrieving data:', err);
        throw err; // Rethrow the error to handle it in the calling function
    } finally {
        // Close the connection
        await mongoClient.close();
    }
}

async function upsertDocuments(collectionName, documents, queryParam) {
    let mongoClient;
    try {
        mongoClient = await setMongoConnection();
        console.log('Connected successfully to MongoDB Atlas', queryParam);

        // Specify the database and collection
        const database = mongoClient.db('movie_phobics');
        const collection = database.collection(collectionName);

        for (const doc of documents) {
            doc.createdDate = new Date();
            const query = { [queryParam]: doc[queryParam] }; // Adjust query based on unique identifier
            const options = { upsert: true };
            const update = { $set: doc };
            await collection.updateOne(query, update, options);
        }
    } catch (err) {
        console.error('Error upserting documents:', err);
        throw err; // Rethrow the error to handle it in the calling function
    } finally {
        // Close the connection
        await mongoClient.close();
    }
}

module.exports = { find, upsertDocuments };
