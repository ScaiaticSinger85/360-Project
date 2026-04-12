const request = require('supertest');
const express = require('express');

jest.mock('../config/db', () => ({
  getCollections: jest.fn(),
  connectToDatabase: jest.fn(),
  getDb: jest.fn(),
}));

const { getCollections } = require('../config/db');
const commentsRoutes = require('../routes/commentsRoutes');

// Mount with the same param merge used in server.js
const app = express();
app.use(express.json());
app.use('/api/events/:eventId/comments', commentsRoutes);

const mockComment = {
  _id: 'commentId1',
  eventId: 'event123',
  userId: 'user1',
  userName: 'Alice',
  avatarUrl: '',
  text: 'Looks like a great event!',
  createdAt: new Date().toISOString(),
};

// ─── GET comments ─────────────────────────────────────────────────────────────

describe('GET /api/events/:eventId/comments', () => {
  it('returns 200 with a list of comments', async () => {
    getCollections.mockReturnValue({
      commentsCollection: {
        find: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue([mockComment]),
          }),
        }),
      },
    });
    const res = await request(app).get('/api/events/event123/comments');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.comments.length).toBe(1);
    expect(res.body.comments[0].text).toBe('Looks like a great event!');
  });
});

// ─── POST comment ─────────────────────────────────────────────────────────────

describe('POST /api/events/:eventId/comments', () => {
  it('returns 400 when required fields are missing', async () => {
    getCollections.mockReturnValue({ commentsCollection: {} });
    const res = await request(app)
      .post('/api/events/event123/comments')
      .send({ text: 'Hello' }); // missing userId and userName
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when text is empty', async () => {
    getCollections.mockReturnValue({ commentsCollection: {} });
    const res = await request(app)
      .post('/api/events/event123/comments')
      .send({ userId: 'u1', userName: 'Alice', text: '   ' });
    expect(res.status).toBe(400);
  });

  it('returns 201 when comment is posted successfully', async () => {
    getCollections.mockReturnValue({
      commentsCollection: {
        insertOne: jest.fn().mockResolvedValue({ insertedId: 'newCommentId' }),
      },
    });
    const res = await request(app)
      .post('/api/events/event123/comments')
      .send({ userId: 'u1', userName: 'Alice', text: 'Great event!' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.comment.text).toBe('Great event!');
  });

  it('sanitizes XSS in comment text', async () => {
    getCollections.mockReturnValue({
      commentsCollection: {
        insertOne: jest.fn().mockResolvedValue({ insertedId: 'xssCommentId' }),
      },
    });
    const res = await request(app)
      .post('/api/events/event123/comments')
      .send({ userId: 'u1', userName: 'Hacker', text: '<script>alert("xss")</script>' });
    expect(res.status).toBe(201);
    // Should be sanitized — no raw < or >
    expect(res.body.comment.text).not.toContain('<script>');
  });
});

// ─── DELETE comment ───────────────────────────────────────────────────────────

describe('DELETE /api/events/:eventId/comments/:commentId', () => {
  it('returns 400 for an invalid comment ID', async () => {
    getCollections.mockReturnValue({ commentsCollection: {} });
    const res = await request(app).delete(
      '/api/events/event123/comments/not-a-valid-id'
    );
    expect(res.status).toBe(400);
  });

  it('returns 404 when comment does not exist', async () => {
    const { ObjectId } = require('mongodb');
    const fakeId = new ObjectId().toString();
    getCollections.mockReturnValue({
      commentsCollection: {
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      },
    });
    const res = await request(app).delete(
      `/api/events/event123/comments/${fakeId}`
    );
    expect(res.status).toBe(404);
  });

  it('returns 200 when comment is deleted successfully', async () => {
    const { ObjectId } = require('mongodb');
    const realId = new ObjectId().toString();
    getCollections.mockReturnValue({
      commentsCollection: {
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      },
    });
    const res = await request(app).delete(
      `/api/events/event123/comments/${realId}`
    );
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
