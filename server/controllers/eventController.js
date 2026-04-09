const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');

function fileToBase64(file) {
  if (!file) return '';

  const base64 = file.buffer.toString('base64');
  return `data:${file.mimetype};base64,${base64}`;
}

function avatarToDisplayString(avatar) {
  if (!avatar) return '';

  if (typeof avatar === 'string') {
    return avatar;
  }

  if (avatar.data && avatar.contentType) {
    let base64String = '';

    if (Buffer.isBuffer(avatar.data)) {
      base64String = avatar.data.toString('base64');
    } else if (avatar.data.buffer) {
      base64String = Buffer.from(avatar.data.buffer).toString('base64');
    } else if (avatar.data.base64) {
      base64String = avatar.data.base64;
    }

    if (base64String) {
      return `data:${avatar.contentType};base64,${base64String}`;
    }
  }

  return '';
}

function formatUser(user) {
  return {
    id: user._id.toString(),
    name: user.name || '',
    email: user.email || '',
    role: user.role || 'user',
    bio: user.bio || '',
    createdAt: user.createdAt || new Date().toISOString(),
    avatarUrl: avatarToDisplayString(user.avatar),
    rsvpEventIds: user.rsvpEventIds || [],
  };
}

async function signup(req, res) {
  try {
    const { usersCollection } = getCollections();
    const data = req.body || {};

    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim().toLowerCase();
    const password = String(data.password || '').trim();
    const passwordConfirm = String(data.passwordConfirm || '').trim();

    if (!name || !email || !password || !passwordConfirm) {
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

    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
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
      bio: '',
      createdAt: new Date().toISOString(),
      avatar: req.file ? fileToBase64(req.file) : '',
      rsvpEventIds: [],
    };

    const result = await usersCollection.insertOne(user);
    const savedUser = await usersCollection.findOne({ _id: result.insertedId });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: formatUser(savedUser),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
}

async function signin(req, res) {
  try {
    const { usersCollection } = getCollections();
    const data = req.body || {};

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
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
}

async function updateProfile(req, res) {
  try {
    const { usersCollection } = getCollections();
    const { userId } = req.params;
    const data = req.body || {};

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID.',
      });
    }

    const existingUser = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const updateData = {};

    if (data.name !== undefined) {
      const name = String(data.name || '').trim();

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Name is required.',
        });
      }

      if (name.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Name must be at least 2 characters.',
        });
      }

      updateData.name = name;
    }

    if (data.bio !== undefined) {
      updateData.bio = String(data.bio || '').trim();
    }

    if (req.file) {
      updateData.avatar = fileToBase64(req.file);
    }

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    const updatedUser = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: formatUser(updatedUser),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
}

async function getUserRsvpEvents(req, res) {
  try {
    const { usersCollection, eventsCollection } = getCollections();
    const { userId } = req.params;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID.',
      });
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const rsvpEventIds = user.rsvpEventIds || [];
    const validObjectIds = rsvpEventIds
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));

    const events = await eventsCollection.find({
      _id: { $in: validObjectIds },
    }).toArray();

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
      rsvpUserIds: event.rsvpUserIds || [],
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
}

module.exports = {
  signup,
  signin,
  updateProfile,
  getUserRsvpEvents,
};