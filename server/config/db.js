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
    const existingCollections = await db.listCollections().toArray();
    const collectionNames = new Set(existingCollections.map((collection) => collection.name));

    if (!collectionNames.has('comments')) {
      await db.createCollection('comments');
    }

    if (!collectionNames.has('reactions')) {
      await db.createCollection('reactions');
    }

    await Promise.all([
      db.collection('users').createIndex({ email: 1 }, { unique: true }),
      db.collection('events').createIndex({ organizerId: 1 }),
      db.collection('events').createIndex({ createdAt: -1 }),
      db.collection('comments').createIndex({ eventId: 1, createdAt: 1 }),
      db.collection('comments').createIndex({ userId: 1, createdAt: -1 }),
      db.collection('reactions').createIndex({ eventId: 1 }),
      db.collection('reactions').createIndex({ eventId: 1, userId: 1 }, { unique: true }),
    ]);

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
    reactionsCollection: database.collection('reactions'),
  };
}

module.exports = {
  connectToDatabase,
  getDb,
  getCollections,
};
