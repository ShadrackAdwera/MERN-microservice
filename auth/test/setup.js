const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../index');

let mongo;
jest.setTimeout(180000);
beforeAll(async(done)=>{
    process.env.JWT_KEY = 'supersecretkey';

    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();
    try {
        await mongoose.connect(mongoUri, ()=>{
            console.log('Connected to Mongo Memory Server');
        });
        done();
    } catch (error) {
        console.log(error);
    }
})

beforeEach(async()=>{
    const collections = await mongoose.connection.db.collections();
    console.log('Before each running . .  .');
    for(const coll of collections) {
        await coll.deleteMany({})
    }
})

afterAll(async()=>{

    await mongo.stop();
    await mongoose.connection.close();
})