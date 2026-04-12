require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectToDatabase, getCollections } = require('../config/db');

const VALID = new Set(['Music', 'Food & Drink', 'Sports & Fitness', 'Arts & Culture', 'Technology', 'Community']);

// Map old/extra categories to the closest valid one
const REMAP = {
  'Networking': 'Community',
  'Business':   'Community',
  'Social':     'Community',
  'Education':  'Community',
  'Art':        'Arts & Culture',
  'Sports':     'Sports & Fitness',
  'Health':     'Sports & Fitness',
  'Fitness':    'Sports & Fitness',
  'Tech':       'Technology',
  'Party':      'Music',
  'Food':       'Food & Drink',
  'Drink':      'Food & Drink',
};

async function migrate() {
  await connectToDatabase();
  const { eventsCollection } = getCollections();

  const events = await eventsCollection.find({}).toArray();
  let updated = 0;

  for (const event of events) {
    if (VALID.has(event.category)) continue;

    const newCategory = REMAP[event.category] || 'Community';
    await eventsCollection.updateOne(
      { _id: event._id },
      { $set: { category: newCategory } }
    );
    console.log(`  "${event.title}": "${event.category}" → "${newCategory}"`);
    updated++;
  }

  console.log(`\nDone. ${updated} event(s) updated.`);
  process.exit(0);
}

migrate().catch((err) => { console.error(err); process.exit(1); });
