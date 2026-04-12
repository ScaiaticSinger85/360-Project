require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { MongoClient } = require('mongodb');

async function fixDuplicates() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db('event_app');
  const reactions = db.collection('reactions');

  // Find all duplicates keeping the first occurrence
  const all = await reactions.find({}).toArray();
  const seen = new Map();
  const toDelete = [];

  for (const doc of all) {
    const key = `${doc.eventId}_${doc.userId}`;
    if (seen.has(key)) {
      toDelete.push(doc._id);
    } else {
      seen.set(key, doc._id);
    }
  }

  if (toDelete.length === 0) {
    console.log('No duplicates found.');
  } else {
    const result = await reactions.deleteMany({ _id: { $in: toDelete } });
    console.log(`Deleted ${result.deletedCount} duplicate reaction(s).`);
  }

  await client.close();
}

fixDuplicates().catch((err) => { console.error(err); process.exit(1); });
