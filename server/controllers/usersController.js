const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');

function formatUser(user) {
  return {
    id: user._id.toString(),
    name: user.name || '',
    email: user.email || '',
    role: user.role || 'user',
    bio: user.bio || '',
    avatarUrl: typeof user.avatar === 'string' ? user.avatar : '',
    isDisabled: user.isDisabled || false,
    createdAt: user.createdAt || '',
  };
}

async function getAllUsers(_req, res) {
  try {
    const { usersCollection } = getCollections();
    const users = await usersCollection.find().sort({ createdAt: -1 }).toArray();
    return res.status(200).json({ success: true, users: users.map(formatUser) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function updateUserRole(req, res) {
  try {
    const { usersCollection } = getCollections();
    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ['registered', 'admin', 'user', 'unregistered'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID.' });
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, message: 'Role updated.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function updateUserStatus(req, res) {
  try {
    const { usersCollection } = getCollections();
    const { userId } = req.params;
    const { isDisabled } = req.body;

    if (typeof isDisabled !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isDisabled must be a boolean.' });
    }

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID.' });
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { isDisabled } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, message: `User ${isDisabled ? 'disabled' : 'enabled'}.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

module.exports = { getAllUsers, updateUserRole, updateUserStatus };
