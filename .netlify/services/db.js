const { isEqual } = require('lodash');
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
        return await client.connect();
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas', err);
        throw err; // Rethrow the error to handle it in the calling function
    } finally {
        // Close the connection
        await client.close();
    }
}

async function find(dbCollection, query, projections, limit = 5) {
    try {
        // Connect the client to the server
        let client = await setMongoConnection();
        await client.connect();
        console.log('Connected successfully to MongoDB Atlas');

        // Specify the database and collection
        const database = client.db('movie_phobics');
        const collection = database.collection(dbCollection);

        // Empty query to get all documents
        const options = {
            projection: projections,
            sort: { createdDate: -1 }
        };

        const cursor = collection.find(query, options).limit(limit);

        // Collect documents into an array
        const results = cursor.toArray()
        console.log(`results: ${JSON.stringify(results)}`);
        return results;
    } catch (err) {
        console.error('Error retrieving data:', err);
        throw err; // Rethrow the error to handle it in the calling function
    } finally {
        // Close the connection
        await client.close();
    }
}

async function upsertDocuments(collectionName, documents, queryParam) {

    try {
        let client = await setMongoConnection();
        await client.connect();
        console.log('Connected successfully to MongoDB Atlas', queryParam);
        // Specify the database and collection
        const database = client.db('movie_phobics');
        const collection = database.collection(collectionName);
        const options = { upsert: true };
        if (isEqual(queryParam, 'movieId')) {
            documents.createdDate = new Date();
            const query = { [queryParam]: documents.id };
            const update = { $set: documents };
            await collection.updateOne(query, update, options);
        }
        else {
            for (const doc of documents) {
                doc.createdDate = new Date();
                const query = { [queryParam]: doc.id }; // Adjust query based on unique identifier
                const update = { $set: doc };
                await collection.updateOne(query, update, options);
            }
        }
    } finally {
        await client.close();
    }
}


module.exports = { find, upsertDocuments };
