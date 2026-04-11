const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');

// Mock the database module before requiring controllers
jest.mock('../config/db', () => ({
  getCollections: jest.fn(),
  connectToDatabase: jest.fn(),
  getDb: jest.fn(),
}));

const { getCollections } = require('../config/db');
const authRoutes = require('../routes/authRoutes');

// Build a minimal Express app for testing
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Signups

describe('POST /api/auth/signup', () => {
  beforeEach(() => {
    getCollections.mockReturnValue({
      usersCollection: {
        findOne: jest.fn().mockResolvedValue(null),
        insertOne: jest.fn().mockResolvedValue({ insertedId: 'mockId123' }),
      },
    });
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app).post('/api/auth/signup').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when passwords do not match', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      passwordConfirm: 'different',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/do not match/i);
  });

  it('returns 400 when password is too short', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Test User',
      email: 'test@test.com',
      password: 'abc',
      passwordConfirm: 'abc',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/6 characters/i);
  });

  it('returns 400 when email already exists', async () => {
    getCollections.mockReturnValue({
      usersCollection: {
        findOne: jest.fn().mockResolvedValue({ email: 'existing@test.com' }),
      },
    });
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Test User',
      email: 'existing@test.com',
      password: 'password123',
      passwordConfirm: 'password123',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('returns 201 on successful signup', async () => {
    const mockUser = {
      _id: 'mockId123',
      name: 'Test User',
      email: 'newuser@test.com',
      role: 'user',
      bio: '',
      createdAt: new Date().toISOString(),
      avatar: '',
      rsvpEventIds: [],
    };
    getCollections.mockReturnValue({
      usersCollection: {
        findOne: jest.fn()
          .mockResolvedValueOnce(null)       // email not taken
          .mockResolvedValueOnce(mockUser),  // fetch after insert
        insertOne: jest.fn().mockResolvedValue({ insertedId: 'mockId123' }),
      },
    });
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Test User',
      email: 'newuser@test.com',
      password: 'password123',
      passwordConfirm: 'password123',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('newuser@test.com');
  });
});

// Sign In Tests

describe('POST /api/auth/signin', () => {
  it('returns 400 when fields are missing', async () => {
    getCollections.mockReturnValue({ usersCollection: { findOne: jest.fn() } });
    const res = await request(app).post('/api/auth/signin').send({});
    expect(res.status).toBe(400);
  });

  it('returns 401 when user is not found', async () => {
    getCollections.mockReturnValue({
      usersCollection: { findOne: jest.fn().mockResolvedValue(null) },
    });
    const res = await request(app).post('/api/auth/signin').send({
      email: 'nobody@test.com',
      password: 'password123',
    });
    expect(res.status).toBe(401);
  });

  it('returns 401 when password is wrong', async () => {
    const hashed = await bcrypt.hash('correctpass', 10);
    getCollections.mockReturnValue({
      usersCollection: {
        findOne: jest.fn().mockResolvedValue({
          _id: 'userId',
          email: 'user@test.com',
          password: hashed,
          isDisabled: false,
        }),
      },
    });
    const res = await request(app).post('/api/auth/signin').send({
      email: 'user@test.com',
      password: 'wrongpass',
    });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/incorrect password/i);
  });

  it('returns 200 with correct credentials', async () => {
    const hashed = await bcrypt.hash('correctpass', 10);
    const mockUser = {
      _id: 'userId',
      name: 'Test User',
      email: 'user@test.com',
      password: hashed,
      role: 'user',
      bio: '',
      createdAt: new Date().toISOString(),
      avatar: '',
      rsvpEventIds: [],
      isDisabled: false,
    };
    getCollections.mockReturnValue({
      usersCollection: { findOne: jest.fn().mockResolvedValue(mockUser) },
    });
    const res = await request(app).post('/api/auth/signin').send({
      email: 'user@test.com',
      password: 'correctpass',
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.password).toBeUndefined(); // password should not be returned
  });

  it('returns 403 when account is disabled', async () => {
    const hashed = await bcrypt.hash('pass', 10);
    getCollections.mockReturnValue({
      usersCollection: {
        findOne: jest.fn().mockResolvedValue({
          _id: 'userId',
          email: 'disabled@test.com',
          password: hashed,
          isDisabled: true,
        }),
      },
    });
    const res = await request(app).post('/api/auth/signin').send({
      email: 'disabled@test.com',
      password: 'pass',
    });
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/disabled/i);
  });
});
