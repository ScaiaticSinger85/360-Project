const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');
const { formatUser } = require('../controllers/authController');

async function loadRequestUser(req) {
  const userId = String(req.headers['x-user-id'] || '').trim();
  const userEmail = String(req.headers['x-user-email'] || '').trim().toLowerCase();
  const { usersCollection } = getCollections();

  const tryEmailFallback = async () => {
    if (!userEmail) {
      return null;
    }

    const fallbackUser = await usersCollection.findOne({ email: userEmail });

    if (!fallbackUser || fallbackUser.isActive === false) {
      return null;
    }

    return formatUser(fallbackUser);
  };

  if (!ObjectId.isValid(userId)) {
    return tryEmailFallback();
  }

  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

  if (!user || user.isActive === false) {
    return tryEmailFallback();
  }

  return formatUser(user);
}

async function requireAuth(req, res, next) {
  try {
    const user = await loadRequestUser(req);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    req.authUser = user;
    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
}

async function requireAdmin(req, res, next) {
  try {
    const user = await loadRequestUser(req);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required.',
      });
    }

    req.authUser = user;
    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
}

module.exports = {
  requireAuth,
  requireAdmin,
};
