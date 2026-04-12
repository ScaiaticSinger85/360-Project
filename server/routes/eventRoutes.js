const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createEvent,
  getAllEvents,
  getEventsByOrganizerId,
  getEventById,
  updateEvent,
  deleteEvent,
  toggleEventRsvp,
  addEventComment,
  setEventReaction,
} = require('../controllers/eventController');

const router = express.Router();

router.get('/', getAllEvents);
router.get('/user/:organizerId', getEventsByOrganizerId);
router.get('/:eventId', getEventById);
router.post('/', requireAuth, upload.single('image'), createEvent);
router.put('/:eventId', requireAuth, upload.single('image'), updateEvent);
router.delete('/:eventId', requireAuth, deleteEvent);
router.post('/:eventId/rsvp', requireAuth, toggleEventRsvp);
router.post('/:eventId/comments', requireAuth, addEventComment);
router.post('/:eventId/reactions', requireAuth, setEventReaction);

module.exports = router;
