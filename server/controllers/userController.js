const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');
const { formatUser } = require('./authController');
const { formatEvent } = require('./eventController');

function matchesRange(isoDate, start, end) {
  const value = new Date(isoDate).getTime();
  if (Number.isNaN(value)) return false;

  if (start) {
    const startValue = new Date(start).getTime();
    if (!Number.isNaN(startValue) && value < startValue) return false;
  }

  if (end) {
    const endValue = new Date(end).getTime() + 24 * 60 * 60 * 1000 - 1;
    if (!Number.isNaN(endValue) && value > endValue) return false;
  }

  return true;
}

async function getAllUsers(req, res) {
  try {
    const { usersCollection, eventsCollection, commentsCollection, reactionsCollection } = getCollections();
    const [users, events, comments, reactions] = await Promise.all([
      usersCollection.find({}).sort({ createdAt: -1 }).toArray(),
      eventsCollection.find({}).toArray(),
      commentsCollection.find({}).toArray(),
      reactionsCollection.find({}).toArray(),
    ]);

    const usersWithStats = users.map((user) => {
      const userId = user._id.toString();

      return {
        ...formatUser(user),
        postCount: events.filter((event) => event.organizerId === userId).length,
        commentCount: comments.filter((comment) => comment.userId === userId).length,
        reactionCount: reactions.filter((reaction) => reaction.userId === userId).length,
      };
    });

    return res.status(200).json({ success: true, users: usersWithStats });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function updateUserRole(req, res) {
  try {
    const { usersCollection } = getCollections();
    const { userId } = req.params;
    const role = String(req.body.role || '').trim();

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID.' });
    }
    if (!['admin', 'registered', 'unregistered'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role, updatedAt: new Date().toISOString() } }
    );

    const updatedUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, user: formatUser(updatedUser) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function updateUserStatus(req, res) {
  try {
    const { usersCollection } = getCollections();
    const { userId } = req.params;
    const { isActive } = req.body;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID.' });
    }
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { isActive, updatedAt: new Date().toISOString() } }
    );

    const updatedUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, user: formatUser(updatedUser) });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function getUsageReport(req, res) {
  try {
    const { usersCollection, eventsCollection, commentsCollection, reactionsCollection } = getCollections();
    const { startDate = '', endDate = '', role = 'all' } = req.query;

    const [users, events, comments, reactions] = await Promise.all([
      usersCollection.find({}).toArray(),
      eventsCollection.find({}).toArray(),
      commentsCollection.find({}).toArray(),
      reactionsCollection.find({}).toArray(),
    ]);

    const filteredUsers = users.filter((user) => {
      if (role !== 'all' && user.role !== role) return false;
      return matchesRange(user.createdAt, startDate, endDate);
    });
    const filteredEvents = events.filter((event) => matchesRange(event.createdAt, startDate, endDate));
    const filteredComments = comments.filter((comment) => matchesRange(comment.createdAt, startDate, endDate));
    const filteredReactions = reactions.filter((reaction) => matchesRange(reaction.createdAt, startDate, endDate));

    const signupsByDate = filteredUsers.reduce((accumulator, user) => {
      const key = String(user.createdAt || '').slice(0, 10);
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});

    const hotThreads = events
      .map((event) => {
        const formatted = formatEvent(event);
        return {
          id: formatted.id,
          title: formatted.title,
          commentCount: formatted.commentCount,
          likeCount: formatted.likeCount,
          score: formatted.commentCount + formatted.likeCount * 2,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      report: {
        filters: { startDate, endDate, role },
        totals: {
          signups: filteredUsers.length,
          posts: filteredEvents.length,
          comments: filteredComments.length,
          likes: filteredReactions.filter((reaction) => reaction.type === 'like').length,
          dislikes: filteredReactions.filter((reaction) => reaction.type === 'dislike').length,
          disabledUsers: users.filter((user) => user.isActive === false).length,
        },
        signupsByDate: Object.entries(signupsByDate)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date)),
        hotThreads,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function getMyCommentHistory(req, res) {
  try {
    const { commentsCollection, eventsCollection } = getCollections();
    const user = req.authUser;

    const comments = await commentsCollection.find({ userId: user.id }).sort({ createdAt: -1 }).toArray();
    const eventIds = comments
      .map((comment) => comment.eventId)
      .filter((eventId) => ObjectId.isValid(eventId))
      .map((eventId) => new ObjectId(eventId));

    const events = eventIds.length ? await eventsCollection.find({ _id: { $in: eventIds } }).toArray() : [];
    const eventMap = new Map(events.map((event) => [event._id.toString(), formatEvent(event)]));

    return res.status(200).json({
      success: true,
      comments: comments.map((comment) => ({
        id: comment._id ? comment._id.toString() : comment.id,
        eventId: comment.eventId,
        eventTitle: eventMap.get(comment.eventId)?.title || 'Deleted event',
        comment: comment.comment,
        createdAt: comment.createdAt,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

async function getAllComments(req, res) {
  try {
    const { commentsCollection, eventsCollection } = getCollections();

    const comments = await commentsCollection.find({}).sort({ createdAt: -1 }).toArray();
    const eventIds = comments
      .map((comment) => comment.eventId)
      .filter((eventId) => ObjectId.isValid(eventId))
      .map((eventId) => new ObjectId(eventId));

    const events = eventIds.length
      ? await eventsCollection.find({ _id: { $in: eventIds } }).toArray()
      : [];

    const eventMap = new Map(events.map((event) => [event._id.toString(), event.title || 'Deleted event']));

    return res.status(200).json({
      success: true,
      comments: comments.map((comment) => ({
        id: comment._id ? comment._id.toString() : comment.id,
        eventId: comment.eventId,
        eventTitle: eventMap.get(comment.eventId) || 'Deleted event',
        userId: comment.userId,
        userName: comment.userName || 'Unknown user',
        comment: comment.comment,
        createdAt: comment.createdAt,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
}

module.exports = {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  getUsageReport,
  getMyCommentHistory,
  getAllComments,
};
