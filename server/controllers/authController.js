const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');
const { imageToDisplayString, formatEvent } = require('./eventController');
const { sanitizeEmail, sanitizeText } = require('../utils/security');

function fileToBase64(file) {
  if (!file) return '';
  const base64 = file.buffer.toString('base64');
  return `data:${file.mimetype};base64,${base64}`;
}

function formatUser(user) {
  return {
    id: user._id.toString(),
    name: user.name || '',
    email: user.email || '',
    role: user.role || 'user',
    bio: user.bio || '',
    createdAt: user.createdAt || new Date().toISOString(),
    avatarUrl: imageToDisplayString(user.avatar),
    rsvpEventIds: Array.isArray(user.rsvpEventIds) ? user.rsvpEventIds : [],
    isActive: user.isActive !== false,
  };
}

function validateEmail(email) {
  return email.includes('@') && email.includes('.');
}

async function signup(req, res) {
  try {
    const { usersCollection } = getCollections();
    const data = req.body || {};
    const name = sanitizeText(data.name);
    const email = sanitizeEmail(data.email);
    const password = String(data.password || '').trim();
    const passwordConfirm = String(data.passwordConfirm || '').trim();

    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Profile image is required.' });
    }
    if (name.length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      name,
      email,
      password: hashedPassword,
      role: 'registered',
      bio: '',
      avatar: fileToBase64(req.file),
      isActive: true,
      rsvpEventIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await usersCollection.insertOne(user);
    const savedUser = await usersCollection.findOne({ _id: result.insertedId });

    return res.status(201).json({ success: true, user: formatUser(savedUser) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function signin(req, res) {
  try {
    const { usersCollection } = getCollections();
    const data = req.body || {};
    const email = sanitizeEmail(data.email);
    const password = String(data.password || '').trim();

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
    }

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'No account found with that email.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Incorrect password.' });
    }
    if (user.isActive === false) {
      return res.status(403).json({ success: false, message: 'This account has been disabled by an admin.' });
    }

    return res.status(200).json({ success: true, user: formatUser(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function updateProfile(req, res) {
  try {
    const { usersCollection } = getCollections();
    const { userId } = req.params;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID.' });
    }
    if (!req.authUser || (req.authUser.id !== userId && req.authUser.role !== 'admin')) {
      return res.status(403).json({ success: false, message: 'Not allowed to update this profile.' });
    }

    const existingUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const updateData = { updatedAt: new Date().toISOString() };

    if (req.body.name !== undefined) {
      const name = sanitizeText(req.body.name);
      if (!name || name.length < 2) {
        return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
      }
      updateData.name = name;
    }

    if (req.body.bio !== undefined) {
      updateData.bio = sanitizeText(req.body.bio);
    }

    if (req.file) {
      updateData.avatar = fileToBase64(req.file);
    }

    await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $set: updateData });
    const updatedUser = await usersCollection.findOne({ _id: new ObjectId(userId) });

    return res.status(200).json({ success: true, user: formatUser(updatedUser) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function updateProfileByEmail(req, res) {
  try {
    const { usersCollection } = getCollections();
    const email = sanitizeEmail(req.params.email);

    if (!email) {
      return res.status(400).json({ success: false, message: 'Invalid email.' });
    }

    if (!req.authUser || (req.authUser.email !== email && req.authUser.role !== 'admin')) {
      return res.status(403).json({ success: false, message: 'Not allowed to update this profile.' });
    }

    const existingUser = await usersCollection.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const updateData = { updatedAt: new Date().toISOString() };

    if (req.body.name !== undefined) {
      const name = sanitizeText(req.body.name);
      if (!name || name.length < 2) {
        return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
      }
      updateData.name = name;
    }

    if (req.body.bio !== undefined) {
      updateData.bio = sanitizeText(req.body.bio);
    }

    if (req.file) {
      updateData.avatar = fileToBase64(req.file);
    }

    await usersCollection.updateOne({ email }, { $set: updateData });
    const updatedUser = await usersCollection.findOne({ email });

    return res.status(200).json({ success: true, user: formatUser(updatedUser) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function getUserById(req, res) {
  try {
    const { usersCollection } = getCollections();
    const { userId } = req.params;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID.' });
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, user: formatUser(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function getUserByEmail(req, res) {
  try {
    const { usersCollection } = getCollections();
    const email = sanitizeEmail(req.params.email);

    if (!email) {
      return res.status(400).json({ success: false, message: 'Invalid email.' });
    }

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, user: formatUser(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function getUserRsvpEvents(req, res) {
  try {
    const { usersCollection, eventsCollection } = getCollections();
    const { userId } = req.params;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID.' });
    }
    if (!req.authUser || (req.authUser.id !== userId && req.authUser.role !== 'admin')) {
      return res.status(403).json({ success: false, message: 'Not allowed to view these RSVPs.' });
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const rsvpEventIds = Array.isArray(user.rsvpEventIds) ? user.rsvpEventIds : [];
    const objectIds = rsvpEventIds
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));

    if (objectIds.length === 0) {
      return res.status(200).json({ success: true, events: [] });
    }

    const events = await eventsCollection.find({ _id: { $in: objectIds } }).toArray();
    return res.status(200).json({ success: true, events: events.map(formatEvent) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

module.exports = {
  signup,
  signin,
  updateProfile,
  updateProfileByEmail,
  getUserById,
  getUserByEmail,
  getUserRsvpEvents,
  formatUser,
};
