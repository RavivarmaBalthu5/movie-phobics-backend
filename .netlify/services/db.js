const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Ravivarma:RavivarmaMongo@movie-phobics.x3v8z.mongodb.net/?retryWrites=true&w=majority&appName=movie-phobics"

// Create a single MongoClient instance
let client;

const initializeMongoClient = async () => {
    if (!client) {
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        try {
            await client.connect();
            console.log('Connected successfully to MongoDB Atlas');
        } catch (err) {
            console.error('Error connecting to MongoDB Atlas', err);
            throw err;
        }
    }
};

// // Immediately invoke the function to initialize MongoClient
// (async () => {
//     await initializeMongoClient();
// })();

async function find(dbCollection, query, projections = {}, sort = {}, limit = 10) {
    await initializeMongoClient(); // Ensure client is connected

    try {
        // Specify the database and collection
        const database = client.db('movie_phobics');
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
        throw err;
    }
}

async function upsertDocuments(collectionName, documents, queryParam) {
    await initializeMongoClient(); // Ensure client is connected

    try {
        // Specify the database and collection
        const database = client.db('movie_phobics');
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
        throw err;
    }
}

// Close the client connection when your application shuts down
async function closeMongoClient() {
    try {
        if (client) {
            await client.close();
            console.log('MongoDB connection closed');
        }
    } catch (err) {
        console.error('Error closing MongoDB connection', err);
    }
}

module.exports = { find, upsertDocuments, closeMongoClient };
