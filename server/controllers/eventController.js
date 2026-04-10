const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');

function sanitize(value) {
  return String(value || '').trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fileToBase64(file) {
  if (!file) return '';
  const base64 = file.buffer.toString('base64');
  return `data:${file.mimetype};base64,${base64}`;
}

function imageToDisplayString(image) {
  if (!image) return '';
  if (typeof image === 'string') return image;
  if (image.data && image.contentType) {
    let base64String = '';
    if (Buffer.isBuffer(image.data)) {
      base64String = image.data.toString('base64');
    } else if (image.data.buffer) {
      base64String = Buffer.from(image.data.buffer).toString('base64');
    } else if (image.data.base64) {
      base64String = image.data.base64;
    }
    if (base64String) return `data:${image.contentType};base64,${base64String}`;
  }
  return '';
}

function formatEvent(event) {
  return {
    id: event._id.toString(),
    title: event.title || '',
    description: event.description || '',
    category: event.category || '',
    date: event.date || '',
    time: event.time || '',
    location: event.location || '',
    address: event.address || '',
    capacity: event.capacity || 0,
    imageUrl: imageToDisplayString(event.imageUrl),
    organizer: event.organizer || '',
    organizerId: event.organizerId || '',
    isPublic: event.isPublic !== undefined ? event.isPublic : true,
    attendees: event.attendees || 0,
    rsvpUserIds: event.rsvpUserIds || [],
    createdAt: event.createdAt || '',
  };
}

async function createEvent(req, res) {
  try {
    const { eventsCollection } = getCollections();
    const data = req.body || {};

    const title = sanitize(data.title);
    const description = sanitize(data.description);
    const category = sanitize(data.category);
    const date = sanitize(data.date);
    const time = sanitize(data.time);
    const location = sanitize(data.location);
    const address = sanitize(data.address);
    const organizer = sanitize(data.organizer);
    const organizerId = sanitize(data.organizerId);
    const capacity = parseInt(data.capacity, 10);
    const isPublic = data.isPublic === 'true' || data.isPublic === true;

    if (!title || !description || !category || !date || !time || !location || !address || !organizer || !organizerId) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    if (isNaN(capacity) || capacity <= 0) {
      return res.status(400).json({ success: false, message: 'Capacity must be a positive number.' });
    }

    const imageUrl = req.file ? fileToBase64(req.file) : sanitize(data.imageUrl);

    const event = {
      title,
      description,
      category,
      date,
      time,
      location,
      address,
      capacity,
      imageUrl,
      organizer,
      organizerId,
      isPublic,
      attendees: 0,
      rsvpUserIds: [],
      createdAt: new Date().toISOString(),
    };

    const result = await eventsCollection.insertOne(event);
    const saved = await eventsCollection.findOne({ _id: result.insertedId });

    return res.status(201).json({ success: true, message: 'Event created.', event: formatEvent(saved) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function getAllEvents(_req, res) {
  try {
    const { eventsCollection } = getCollections();
    const events = await eventsCollection.find().sort({ createdAt: -1 }).toArray();
    return res.status(200).json({ success: true, events: events.map(formatEvent) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function getEventsByOrganizerId(req, res) {
  try {
    const { eventsCollection } = getCollections();
    const { organizerId } = req.params;
    const events = await eventsCollection.find({ organizerId }).sort({ createdAt: -1 }).toArray();
    return res.status(200).json({ success: true, events: events.map(formatEvent) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function getEventById(req, res) {
  try {
    const { eventsCollection } = getCollections();
    const { eventId } = req.params;

    if (!ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID.' });
    }

    const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    return res.status(200).json({ success: true, event: formatEvent(event) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function updateEvent(req, res) {
  try {
    const { eventsCollection } = getCollections();
    const { eventId } = req.params;
    const data = req.body || {};

    if (!ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID.' });
    }

    const existing = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const updateData = {};

    if (data.title !== undefined) updateData.title = sanitize(data.title);
    if (data.description !== undefined) updateData.description = sanitize(data.description);
    if (data.category !== undefined) updateData.category = sanitize(data.category);
    if (data.date !== undefined) updateData.date = sanitize(data.date);
    if (data.time !== undefined) updateData.time = sanitize(data.time);
    if (data.location !== undefined) updateData.location = sanitize(data.location);
    if (data.address !== undefined) updateData.address = sanitize(data.address);
    if (data.capacity !== undefined) updateData.capacity = parseInt(data.capacity, 10);
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic === 'true' || data.isPublic === true;
    if (req.file) updateData.imageUrl = fileToBase64(req.file);
    else if (data.imageUrl !== undefined) updateData.imageUrl = sanitize(data.imageUrl);

    await eventsCollection.updateOne({ _id: new ObjectId(eventId) }, { $set: updateData });
    const updated = await eventsCollection.findOne({ _id: new ObjectId(eventId) });

    return res.status(200).json({ success: true, message: 'Event updated.', event: formatEvent(updated) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function deleteEvent(req, res) {
  try {
    const { eventsCollection } = getCollections();
    const { eventId } = req.params;

    if (!ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID.' });
    }

    const result = await eventsCollection.deleteOne({ _id: new ObjectId(eventId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    return res.status(200).json({ success: true, message: 'Event deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function toggleEventRsvp(req, res) {
  try {
    const { eventsCollection, usersCollection } = getCollections();
    const { eventId } = req.params;
    const { userId } = req.body;

    if (!ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID.' });
    }

    const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const rsvpUserIds = event.rsvpUserIds || [];
    const alreadyRsvpd = rsvpUserIds.includes(userId);

    let updatedRsvpIds;
    let attendeesDelta;

    if (alreadyRsvpd) {
      updatedRsvpIds = rsvpUserIds.filter((id) => id !== userId);
      attendeesDelta = -1;
    } else {
      if (event.attendees >= event.capacity) {
        return res.status(400).json({ success: false, message: 'Event is full.' });
      }
      updatedRsvpIds = [...rsvpUserIds, userId];
      attendeesDelta = 1;
    }

    await eventsCollection.updateOne(
      { _id: new ObjectId(eventId) },
      { $set: { rsvpUserIds: updatedRsvpIds, attendees: (event.attendees || 0) + attendeesDelta } }
    );

    if (ObjectId.isValid(userId)) {
      if (alreadyRsvpd) {
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $pull: { rsvpEventIds: eventId } }
        );
      } else {
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $addToSet: { rsvpEventIds: eventId } }
        );
      }
    }

    const updated = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
    return res.status(200).json({ success: true, rsvpd: !alreadyRsvpd, event: formatEvent(updated) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

module.exports = {
  createEvent,
  getAllEvents,
  getEventsByOrganizerId,
  getEventById,
  updateEvent,
  deleteEvent,
  toggleEventRsvp,
};
