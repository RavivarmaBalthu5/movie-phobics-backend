const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
if (!uri) {
    throw new Error('MONGODB_URI is not defined');
}
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

async function find(dbCollection, query, projections = {}, sort = {}, limit = 10) {
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
        await client.close();
    }
}

async function aggregate(dbCollection, pipeline = [], limit = 100) {

    try {
        // Connect the client to the server
        let client = await setMongoConnection();
        await client.connect();
        console.log('Connected successfully to MongoDB Atlas');

        // Specify the database and collection
        const database = client.db('movie_phobics');
        const collection = database.collection(dbCollection);

        // Modify the pipeline to include a limit if it's not already part of the pipeline
        if (!pipeline.some(stage => '$limit' in stage)) {
            pipeline.push({ $limit: limit });
        }

        // Run the aggregation pipeline and use await to resolve the cursor
        const results = await collection.aggregate(pipeline).toArray();

        return results;
    } catch (err) {
        console.error('Error performing aggregation:', err);
        throw err; // Rethrow the error to handle it in the calling function
    } finally {
        if (client) {
            // Close the connection
            await client.close();
        }
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
        for (const doc of documents) {
            doc.createdDate = new Date();
            const query = { [queryParam]: doc[queryParam] }; // Adjust query based on unique identifier
            const options = { upsert: true };
            const update = { $set: doc };
            await collection.updateOne(query, update, options);
        }
        console.log('Successfully inserted to DB');
    } finally {
        await client.close();
    }
}


// Create user with hashed password
async function createUser({ name, email, password }) {
    let client;

    try {
        client = await setMongoConnection();
        const database = client.db('movie_phobics');
        const collection = database.collection('users');
        const newUser = {
            name,
            email,
            password,
            createdAt: new Date()
        };

        const result = await collection.insertOne(newUser);
        return { id: result.insertedId, name, email };
    } catch (err) {
        throw err;
    } finally {
        if (client) await client.close();
    }
}

async function verifyUser(email, password) {
    let client;

    try {
        client = await setMongoConnection();
        const database = client.db('movie_phobics');
        const collection = database.collection('users');
        const user = await collection.findOne({ email });
        return { id: user._id, name: user.name, email: user.email };
    } catch (err) {
        throw err;
    } finally {
        if (client) await client.close();
    }
}



module.exports = { find, upsertDocuments, aggregate, verifyUser, createUser };
