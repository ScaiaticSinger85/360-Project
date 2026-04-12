const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { requireAuth } = require('../middleware/authMiddleware');
const {
  signup,
  signin,
  updateProfile,
  updateProfileByEmail,
  getUserById,
  getUserByEmail,
  getUserRsvpEvents,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', upload.single('avatar'), signup);
router.post('/signin', signin);
router.get('/profile-by-email/:email', requireAuth, getUserByEmail);
router.put('/profile-by-email/:email', requireAuth, upload.single('avatar'), updateProfileByEmail);
router.get('/profile/:userId', requireAuth, getUserById);
router.put('/profile/:userId', requireAuth, upload.single('avatar'), updateProfile);
router.get('/:userId/rsvps', requireAuth, getUserRsvpEvents);

module.exports = router;
