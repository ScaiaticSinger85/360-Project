const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const {
  createEvent,
  getAllEvents,
  getEventsByOrganizerId,
  getEventById,
  updateEvent,
  deleteEvent,
  toggleEventRsvp,
} = require('../controllers/eventController');

const router = express.Router();

router.post('/', upload.single('image'), createEvent);
router.get('/', getAllEvents);
router.get('/user/:organizerId', getEventsByOrganizerId);
router.get('/:eventId', getEventById);
router.put('/:eventId', upload.single('image'), updateEvent);
router.delete('/:eventId', deleteEvent);
router.post('/:eventId/rsvp', toggleEventRsvp);

module.exports = router;