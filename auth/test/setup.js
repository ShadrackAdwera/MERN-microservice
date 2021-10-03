const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../index');

let mongo;
beforeAll(async()=>{
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    try {
        await mongoose.connect(mongoUri, ()=>{
            console.log('Connected to Mongo Memory Server');
        });
    } catch (error) {
        console.log(error);
    }
})

beforeEach(async()=>{
    const collections = await mongoose.connection.db.collections();
    collections.forEach(coll=>await coll.deleteMany({}))
})

afterAll(async()=>{
    await mongo.stop();
    await mongoose.connection.close();
})