const request = require('supertest');
const express = require('express');

jest.mock('../config/db', () => ({
  getCollections: jest.fn(),
  connectToDatabase: jest.fn(),
  getDb: jest.fn(),
}));

// Also mock multer so file upload middleware doesn't block tests
jest.mock('../middleware/uploadMiddleware', () => ({
  single: () => (req, _res, next) => next(),
}));

const { getCollections } = require('../config/db');
const eventRoutes = require('../routes/eventRoutes');

const app = express();
app.use(express.json());
app.use('/api/events', eventRoutes);

const mockEvent = {
  _id: 'eventId123',
  title: 'Test Concert',
  description: 'A great concert in Kelowna',
  category: 'Music',
  date: '2026-08-01',
  time: '19:00',
  location: 'City Park',
  address: '100 Main St, Kelowna, BC',
  capacity: 200,
  imageUrl: 'https://example.com/image.jpg',
  organizer: 'Test Organizer',
  organizerId: 'org123',
  isPublic: true,
  attendees: 0,
  rsvpUserIds: [],
  createdAt: new Date().toISOString(),
};

// ─── GET /api/events ──────────────────────────────────────────────────────────

describe('GET /api/events', () => {
  it('returns 200 and an array of events', async () => {
    getCollections.mockReturnValue({
      eventsCollection: {
        find: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue([mockEvent]),
          }),
        }),
      },
    });
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.events)).toBe(true);
    expect(res.body.events.length).toBe(1);
    expect(res.body.events[0].title).toBe('Test Concert');
  });
});

// ─── POST /api/events ─────────────────────────────────────────────────────────

describe('POST /api/events', () => {
  it('returns 400 when required fields are missing', async () => {
    getCollections.mockReturnValue({ eventsCollection: {} });
    const res = await request(app).post('/api/events').send({ title: 'Only Title' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when capacity is invalid', async () => {
    getCollections.mockReturnValue({ eventsCollection: {} });
    const res = await request(app).post('/api/events').send({
      ...mockEvent,
      capacity: -1,
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/capacity/i);
  });

  it('returns 201 when event is created successfully', async () => {
    getCollections.mockReturnValue({
      eventsCollection: {
        insertOne: jest.fn().mockResolvedValue({ insertedId: 'newEventId' }),
        findOne: jest.fn().mockResolvedValue({ ...mockEvent, _id: 'newEventId' }),
      },
    });
    const res = await request(app).post('/api/events').send(mockEvent);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.event).toBeDefined();
  });
});

// ─── DELETE /api/events/:eventId ──────────────────────────────────────────────

describe('DELETE /api/events/:eventId', () => {
  it('returns 400 for an invalid event ID', async () => {
    getCollections.mockReturnValue({ eventsCollection: {} });
    const res = await request(app).delete('/api/events/not-a-valid-id');
    expect(res.status).toBe(400);
  });

  it('returns 404 when event does not exist', async () => {
    const { ObjectId } = require('mongodb');
    const fakeId = new ObjectId().toString();
    getCollections.mockReturnValue({
      eventsCollection: {
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      },
    });
    const res = await request(app).delete(`/api/events/${fakeId}`);
    expect(res.status).toBe(404);
  });
});

// ─── POST /api/events/:eventId/rsvp ──────────────────────────────────────────

describe('POST /api/events/:eventId/rsvp', () => {
  it('returns 400 for invalid event ID', async () => {
    getCollections.mockReturnValue({ eventsCollection: {} });
    const res = await request(app)
      .post('/api/events/bad-id/rsvp')
      .send({ userId: 'user1' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when event is full', async () => {
    const { ObjectId } = require('mongodb');
    const eventId = new ObjectId().toString();
    getCollections.mockReturnValue({
      eventsCollection: {
        findOne: jest.fn().mockResolvedValue({
          _id: eventId,
          attendees: 10,
          capacity: 10,
          rsvpUserIds: [],
        }),
      },
    });
    const res = await request(app)
      .post(`/api/events/${eventId}/rsvp`)
      .send({ userId: 'newUser' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/full/i);
  });
});
