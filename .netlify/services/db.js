const { isEmpty } = require('lodash');
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI
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
        return await client.connect();
    } catch (err) {
        throw err;
    } finally {
        await client.close();
    }
}

async function find(dbCollection, query, projections = {}, sort = {}, limit = 10) {
    try {
        let client = await setMongoConnection();
        await client.connect();

        const database = client.db('movie_phobics');
        const collection = database.collection(dbCollection);

        const options = {
            projection: projections,
            sort: sort
        };

        const cursor = collection.find(query, options).limit(limit);

        const results = [];
        await cursor.forEach(doc => results.push(doc));
        return results;
    } catch (err) {
        console.error('Error retrieving data:', err);
        throw err;
    } finally {
        await client.close();
    }
}

async function aggregate(dbCollection, pipeline = [], limit = 100) {

    try {
        let client = await setMongoConnection();
        await client.connect();

        const database = client.db('movie_phobics');
        const collection = database.collection(dbCollection);

        if (!pipeline.some(stage => '$limit' in stage)) {
            pipeline.push({ $limit: limit });
        }

        const results = await collection.aggregate(pipeline).toArray();

        return results;
    } catch (err) {
        console.error('Error performing aggregation:', err);
        throw err;
    } finally {
        if (client) {
            await client.close();
        }
    }
}
async function upsertDocuments(collectionName, documents, queryParam) {

    try {
        let client = await setMongoConnection();
        await client.connect();
        const database = client.db('movie_phobics');
        const collection = database.collection(collectionName);
        for (const doc of documents) {
            doc.createdDate = new Date();
            const query = { [queryParam]: doc[queryParam] };
            const options = { upsert: true };
            const update = { $set: doc };
            await collection.updateOne(query, update, options);
        }
    } finally {
        await client.close();
    }
}


async function createUser({ name, email, password }) {
    let client;

    try {
        client = await setMongoConnection();
        await client.connect();
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

async function getUser(email) {
    let client;

    try {
        client = await setMongoConnection();
        await client.connect();
        const database = client.db('movie_phobics');
        const collection = database.collection('users');
        const user = await collection.findOne({ email });
        if (isEmpty(user)) {
            return
        }
        return { password: user.password, email: user.email };
    } catch (err) {
        throw err;
    } finally {
        if (client) await client.close();
    }
}



module.exports = { find, upsertDocuments, aggregate, getUser, createUser };
