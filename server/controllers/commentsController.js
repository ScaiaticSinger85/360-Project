const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');

function sanitize(value) {
  return String(value || '').trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function getComments(req, res) {
  try {
    const { commentsCollection } = getCollections();
    const { eventId } = req.params;

    const comments = await commentsCollection
      .find({ eventId })
      .sort({ createdAt: -1 })
      .toArray();

    const formatted = comments.map((c) => ({
      id: c._id.toString(),
      eventId: c.eventId,
      userId: c.userId,
      userName: c.userName,
      text: c.text,
      createdAt: c.createdAt,
    }));

    return res.status(200).json({ success: true, comments: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function addComment(req, res) {
  try {
    const { commentsCollection } = getCollections();
    const { eventId } = req.params;
    const { userId, userName, text } = req.body;

    if (!userId || !userName || !text || !String(text).trim()) {
      return res.status(400).json({ success: false, message: 'userId, userName, and text are required.' });
    }

    const comment = {
      eventId,
      userId: sanitize(userId),
      userName: sanitize(userName),
      text: sanitize(text),
      createdAt: new Date().toISOString(),
    };

    const result = await commentsCollection.insertOne(comment);

    return res.status(201).json({
      success: true,
      comment: { id: result.insertedId.toString(), ...comment },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function deleteComment(req, res) {
  try {
    const { commentsCollection } = getCollections();
    const { commentId } = req.params;

    if (!ObjectId.isValid(commentId)) {
      return res.status(400).json({ success: false, message: 'Invalid comment ID.' });
    }

    const result = await commentsCollection.deleteOne({ _id: new ObjectId(commentId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Comment not found.' });
    }

    return res.status(200).json({ success: true, message: 'Comment deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

module.exports = { getComments, addComment, deleteComment };
