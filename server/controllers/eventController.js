const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');
const { sanitizeText } = require('../utils/security');

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

    if (base64String) {
      return `data:${image.contentType};base64,${base64String}`;
    }
  }

  return '';
}

function normalizeComment(comment) {
  return {
    id: comment.id || new ObjectId().toString(),
    userId: comment.userId || '',
    userName: comment.userName || 'Anonymous',
    comment: comment.comment || '',
    createdAt: comment.createdAt || new Date().toISOString(),
  };
}

function formatEvent(event, options = {}) {
  const comments = Array.isArray(options.comments)
    ? options.comments.map(normalizeComment)
    : Array.isArray(event.comments)
      ? event.comments.map(normalizeComment)
      : [];
  const likeUserIds = Array.isArray(options.likeUserIds)
    ? options.likeUserIds
    : Array.isArray(event.likeUserIds)
      ? event.likeUserIds
      : [];
  const dislikeUserIds = Array.isArray(options.dislikeUserIds)
    ? options.dislikeUserIds
    : Array.isArray(event.dislikeUserIds)
      ? event.dislikeUserIds
      : [];
  const rsvpUserIds = Array.isArray(event.rsvpUserIds) ? event.rsvpUserIds : [];

  return {
    id: event._id.toString(),
    title: event.title || '',
    description: event.description || '',
    category: event.category || '',
    date: event.date || '',
    time: event.time || '',
    location: event.location || '',
    address: event.address || '',
    capacity: Number(event.capacity || 0),
    imageUrl: imageToDisplayString(event.imageUrl),
    organizer: event.organizer || event.organizerName || '',
    organizerName: event.organizerName || event.organizer || '',
    organizerId: event.organizerId || '',
    isPublic: Boolean(event.isPublic),
    attendees: Number(event.attendees || rsvpUserIds.length || 0),
    rsvpUserIds,
    comments,
    commentCount: comments.length,
    likeUserIds,
    dislikeUserIds,
    likeCount: likeUserIds.length,
    dislikeCount: dislikeUserIds.length,
    createdAt: event.createdAt || new Date().toISOString(),
    updatedAt: event.updatedAt || event.createdAt || new Date().toISOString(),
  };
}

async function hydrateEvent(event) {
  const { commentsCollection, reactionsCollection } = getCollections();
  const eventId = event._id.toString();
  const [comments, reactions] = await Promise.all([
    commentsCollection.find({ eventId }).sort({ createdAt: 1 }).toArray(),
    reactionsCollection.find({ eventId }).toArray(),
  ]);

  return formatEvent(event, {
    comments,
    likeUserIds: reactions
      .filter((reaction) => reaction.type === 'like')
      .map((reaction) => reaction.userId),
    dislikeUserIds: reactions
      .filter((reaction) => reaction.type === 'dislike')
      .map((reaction) => reaction.userId),
  });
}

async function hydrateEvents(events) {
  return Promise.all(events.map((event) => hydrateEvent(event)));
}

function canMutateEvent(user, event) {
  return user && (user.role === 'admin' || user.id === event.organizerId);
}

function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true';
  return false;
}

function validateEventPayload(data) {
  const title = sanitizeText(data.title);
  const description = sanitizeText(data.description);
  const category = sanitizeText(data.category);
  const date = sanitizeText(data.date);
  const time = sanitizeText(data.time);
  const location = sanitizeText(data.location);
  const address = sanitizeText(data.address);
  const capacity = Number.parseInt(String(data.capacity || '0'), 10);
  const imageUrl = String(data.imageUrl || '').trim();
  const isPublic = parseBoolean(data.isPublic);

  if (!title || title.length < 5) {
    return { error: 'Title must be at least 5 characters.' };
  }
  if (!description || description.length < 20) {
    return { error: 'Description must be at least 20 characters.' };
  }
  if (!category || !date || !time || !location || !address) {
    return { error: 'Please fill in all event fields.' };
  }
  if (!Number.isFinite(capacity) || capacity <= 0) {
    return { error: 'Capacity must be greater than 0.' };
  }
  if (!imageUrl && !data.imageFile) {
    return { error: 'Please provide an event image or image URL.' };
  }

  return {
    value: {
      title,
      description,
      category,
      date,
      time,
      location,
      address,
      capacity,
      imageUrl,
      isPublic,
    },
  };
}

async function createEvent(req, res) {
  try {
    const { eventsCollection } = getCollections();
    const user = req.authUser;

    if (!user) {
      return res.status(401).json({ success: false, message: 'Please sign in.' });
    }

    const validation = validateEventPayload({ ...req.body, imageFile: req.file });
    if (validation.error) {
      return res.status(400).json({ success: false, message: validation.error });
    }

    const event = {
      ...validation.value,
      imageUrl: req.file ? fileToBase64(req.file) : validation.value.imageUrl,
      organizer: user.name,
      organizerName: user.name,
      organizerId: user.id,
      attendees: 0,
      rsvpUserIds: [],
      comments: [],
      likeUserIds: [],
      dislikeUserIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await eventsCollection.insertOne(event);
    const savedEvent = await eventsCollection.findOne({ _id: result.insertedId });

    return res.status(201).json({ success: true, event: await hydrateEvent(savedEvent) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function getAllEvents(req, res) {
  try {
    const { eventsCollection } = getCollections();
    const events = await eventsCollection.find({}).sort({ createdAt: -1 }).toArray();
    return res.status(200).json({ success: true, events: await hydrateEvents(events) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function getEventsByOrganizerId(req, res) {
  try {
    const { eventsCollection } = getCollections();
    const { organizerId } = req.params;
    const events = await eventsCollection.find({ organizerId }).sort({ createdAt: -1 }).toArray();
    return res.status(200).json({ success: true, events: await hydrateEvents(events) });
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

    return res.status(200).json({ success: true, event: await hydrateEvent(event) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function updateEvent(req, res) {
  try {
    const { eventsCollection } = getCollections();
    const { eventId } = req.params;

    if (!ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID.' });
    }

    const existingEvent = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
    if (!existingEvent) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    if (!canMutateEvent(req.authUser, formatEvent(existingEvent))) {
      return res.status(403).json({ success: false, message: 'Not allowed to edit this event.' });
    }

    const validation = validateEventPayload({
      ...req.body,
      imageFile: req.file,
      imageUrl: req.body.imageUrl || imageToDisplayString(existingEvent.imageUrl),
    });

    if (validation.error) {
      return res.status(400).json({ success: false, message: validation.error });
    }

    const updateData = {
      ...validation.value,
      imageUrl: req.file
        ? fileToBase64(req.file)
        : validation.value.imageUrl || imageToDisplayString(existingEvent.imageUrl),
      updatedAt: new Date().toISOString(),
    };

    await eventsCollection.updateOne({ _id: new ObjectId(eventId) }, { $set: updateData });
    const updatedEvent = await eventsCollection.findOne({ _id: new ObjectId(eventId) });

    return res.status(200).json({ success: true, event: await hydrateEvent(updatedEvent) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function deleteEvent(req, res) {
  try {
    const { eventsCollection, commentsCollection, reactionsCollection, usersCollection } = getCollections();
    const { eventId } = req.params;

    if (!ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID.' });
    }

    const existingEvent = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
    if (!existingEvent) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    if (!canMutateEvent(req.authUser, formatEvent(existingEvent))) {
      return res.status(403).json({ success: false, message: 'Not allowed to delete this event.' });
    }

    await eventsCollection.deleteOne({ _id: new ObjectId(eventId) });
    await commentsCollection.deleteMany({ eventId });
    await reactionsCollection.deleteMany({ eventId });
    await usersCollection.updateMany({}, { $pull: { rsvpEventIds: eventId } });

    return res.status(200).json({ success: true, message: 'Event deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function toggleEventRsvp(req, res) {
  try {
    const { eventsCollection, usersCollection } = getCollections();
    const { eventId } = req.params;
    const user = req.authUser;

    if (!user) {
      return res.status(401).json({ success: false, message: 'Please sign in.' });
    }

    if (!ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID.' });
    }

    const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const formattedEvent = formatEvent(event);
    const hasRsvped = formattedEvent.rsvpUserIds.includes(user.id);

    await eventsCollection.updateOne(
      { _id: new ObjectId(eventId) },
      hasRsvped
        ? {
            $pull: { rsvpUserIds: user.id },
            $set: {
              attendees: Math.max(0, formattedEvent.attendees - 1),
              updatedAt: new Date().toISOString(),
            },
          }
        : {
            $addToSet: { rsvpUserIds: user.id },
            $set: {
              attendees: formattedEvent.attendees + 1,
              updatedAt: new Date().toISOString(),
            },
          }
    );

    await usersCollection.updateOne(
      { _id: new ObjectId(user.id) },
      hasRsvped ? { $pull: { rsvpEventIds: eventId } } : { $addToSet: { rsvpEventIds: eventId } }
    );

    const updatedEvent = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
    return res.status(200).json({
      success: true,
      event: await hydrateEvent(updatedEvent),
      isRsvped: !hasRsvped,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function addEventComment(req, res) {
  try {
    const { eventsCollection, commentsCollection } = getCollections();
    const { eventId } = req.params;
    const user = req.authUser;
    const commentText = sanitizeText(req.body.comment);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Please sign in.' });
    }
    if (!ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID.' });
    }
    if (!commentText || commentText.length < 2) {
      return res.status(400).json({ success: false, message: 'Comment is too short.' });
    }

    const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const comment = {
      id: new ObjectId().toString(),
      eventId,
      userId: user.id,
      userName: user.name,
      comment: commentText,
      createdAt: new Date().toISOString(),
    };

    await eventsCollection.updateOne(
      { _id: new ObjectId(eventId) },
      {
        $push: { comments: comment },
        $set: { updatedAt: new Date().toISOString() },
      }
    );
    await commentsCollection.insertOne(comment);

    const updatedEvent = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
    return res.status(201).json({
      success: true,
      comment,
      event: await hydrateEvent(updatedEvent),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function setEventReaction(req, res) {
  try {
    const { eventsCollection, reactionsCollection } = getCollections();
    const { eventId } = req.params;
    const user = req.authUser;
    const reaction = String(req.body.reaction || '').trim().toLowerCase();

    if (!user) {
      return res.status(401).json({ success: false, message: 'Please sign in.' });
    }
    if (!ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID.' });
    }
    if (!['like', 'dislike', 'clear'].includes(reaction)) {
      return res.status(400).json({ success: false, message: 'Invalid reaction.' });
    }

    const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    await eventsCollection.updateOne(
      { _id: new ObjectId(eventId) },
      {
        $pull: { likeUserIds: user.id, dislikeUserIds: user.id },
        $set: { updatedAt: new Date().toISOString() },
      }
    );

    if (reaction === 'like') {
      await eventsCollection.updateOne(
        { _id: new ObjectId(eventId) },
        { $addToSet: { likeUserIds: user.id } }
      );
    }

    if (reaction === 'dislike') {
      await eventsCollection.updateOne(
        { _id: new ObjectId(eventId) },
        { $addToSet: { dislikeUserIds: user.id } }
      );
    }

    if (reaction === 'clear') {
      await reactionsCollection.deleteMany({ eventId, userId: user.id });
    } else {
      await reactionsCollection.updateOne(
        { eventId, userId: user.id },
        {
          $set: {
            eventId,
            userId: user.id,
            type: reaction,
            createdAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );
    }

    const updatedEvent = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
    return res.status(200).json({ success: true, event: await hydrateEvent(updatedEvent) });
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
  addEventComment,
  setEventReaction,
  formatEvent,
  imageToDisplayString,
};
