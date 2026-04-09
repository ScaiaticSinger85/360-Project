const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const {
  signup,
  signin,
  updateProfile,
  getUserRsvpEvents,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', upload.single('avatar'), signup);
router.post('/signin', signin);
router.put('/profile/:userId', upload.single('avatar'), updateProfile);
router.get('/:userId/rsvps', getUserRsvpEvents);

module.exports = router;