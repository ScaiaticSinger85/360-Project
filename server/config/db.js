const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is missing from .env');
}

const client = new MongoClient(MONGO_URI);

let db;

async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db('event_app');
    console.log('Connected to MongoDB');
  }

  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not connected yet');
  }

  return db;
}

function getCollections() {
  const database = getDb();

  return {
    usersCollection: database.collection('users'),
    eventsCollection: database.collection('events'),
    commentsCollection: database.collection('comments'),
  };
}

module.exports = {
  connectToDatabase,
  getDb,
  getCollections,
};