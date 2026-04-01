require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://OLAMIPOADE:mipotop12@cluster0.xca99lx.mongodb.net/?appName=Cluster0';

const client = new MongoClient(MONGO_URI);

let db;
let usersCollection;
let eventsCollection;

async function connectToDatabase() {
  await client.connect();
  db = client.db('event_app');
  usersCollection = db.collection('users');
  eventsCollection = db.collection('events');
  console.log('Connected to MongoDB');
}

app.post('/api/auth/signup', async (req, res) => {
  try {
    const data = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'No data received.',
      });
    }

    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim().toLowerCase();
    const password = String(data.password || '').trim();

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all fields.',
      });
    }

    if (name.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters.',
      });
    }

    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      role: 'user',
    };

    const result = await usersCollection.insertOne(user);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: {
        id: result.insertedId.toString(),
        name,
        email,
        role: 'user',
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const data = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'No data received.',
      });
    }

    const email = String(data.email || '').trim().toLowerCase();
    const password = String(data.password || '').trim();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all fields.',
      });
    }

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with that email.',
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Signed in successfully.',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const data = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'No JSON data received.',
      });
    }

    const requiredFields = [
      'title',
      'description',
      'category',
      'date',
      'time',
      'location',
      'address',
      'capacity',
      'imageUrl',
      'organizer',
      'organizerId',
      'isPublic',
    ];

    const missingFields = [];

    for (const field of requiredFields) {
      const value = data[field];
      if (value === undefined || value === null || value === '') {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    const event = {
      title: String(data.title).trim(),
      description: String(data.description).trim(),
      category: String(data.category).trim(),
      date: String(data.date).trim(),
      time: String(data.time).trim(),
      location: String(data.location).trim(),
      address: String(data.address).trim(),
      capacity: parseInt(data.capacity, 10),
      imageUrl: String(data.imageUrl).trim(),
      organizer: String(data.organizer).trim(),
      organizerId: String(data.organizerId).trim(),
      isPublic: Boolean(data.isPublic),
      attendees: 0,
    };

    const result = await eventsCollection.insertOne(event);

    const savedEvent = {
      id: result.insertedId.toString(),
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date,
      time: event.time,
      location: event.location,
      address: event.address,
      capacity: event.capacity,
      imageUrl: event.imageUrl,
      organizer: event.organizer,
      organizerId: event.organizerId,
      isPublic: event.isPublic,
      attendees: event.attendees,
    };

    return res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      event: savedEvent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
});

app.get('/api/events', async (_req, res) => {
  try {
    const events = await eventsCollection.find().toArray();

    const formattedEvents = events.map((event) => ({
      id: event._id.toString(),
      title: event.title || '',
      description: event.description || '',
      category: event.category || '',
      date: event.date || '',
      time: event.time || '',
      location: event.location || '',
      address: event.address || '',
      capacity: event.capacity || 0,
      imageUrl: event.imageUrl || '',
      organizer: event.organizer || '',
      organizerId: event.organizerId || '',
      isPublic: event.isPublic || false,
      attendees: event.attendees || 0,
    }));

    return res.status(200).json({
      success: true,
      events: formattedEvents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
});

app.put('/api/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const data = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'No JSON data received.',
      });
    }

    const requiredFields = [
      'title',
      'description',
      'category',
      'date',
      'time',
      'location',
      'address',
      'capacity',
      'imageUrl',
      'isPublic',
    ];

    const missingFields = [];

    for (const field of requiredFields) {
      const value = data[field];
      if (value === undefined || value === null || value === '') {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    let existingEvent;
    try {
      existingEvent = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID.',
      });
    }

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    const updatedData = {
      title: String(data.title).trim(),
      description: String(data.description).trim(),
      category: String(data.category).trim(),
      date: String(data.date).trim(),
      time: String(data.time).trim(),
      location: String(data.location).trim(),
      address: String(data.address).trim(),
      capacity: parseInt(data.capacity, 10),
      imageUrl: String(data.imageUrl).trim(),
      isPublic: Boolean(data.isPublic),
      attendees: parseInt(
        data.attendees !== undefined ? data.attendees : existingEvent.attendees || 0,
        10
      ),
    };

    await eventsCollection.updateOne(
      { _id: new ObjectId(eventId) },
      { $set: updatedData }
    );

    const updatedEvent = await eventsCollection.findOne({ _id: new ObjectId(eventId) });

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      event: {
        id: updatedEvent._id.toString(),
        title: updatedEvent.title || '',
        description: updatedEvent.description || '',
        category: updatedEvent.category || '',
        date: updatedEvent.date || '',
        time: updatedEvent.time || '',
        location: updatedEvent.location || '',
        address: updatedEvent.address || '',
        capacity: updatedEvent.capacity || 0,
        imageUrl: updatedEvent.imageUrl || '',
        organizer: updatedEvent.organizer || '',
        organizerId: updatedEvent.organizerId || '',
        isPublic: updatedEvent.isPublic || false,
        attendees: updatedEvent.attendees || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
});

app.delete('/api/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    let result;
    try {
      result = await eventsCollection.deleteOne({ _id: new ObjectId(eventId) });
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID.',
      });
    }

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
});

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });