const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;
const USERS_FILE = path.join(__dirname, 'users.json');

// --- In-memory events store (partner: replace with MongoDB) ---
let events = [
  {
    id: 'event_1',
    title: 'Kelowna Summer Music Festival',
    description: 'Join us for an amazing outdoor music festival featuring local and international artists. Enjoy food trucks, craft beer, and stunning views of Okanagan Lake.',
    category: 'Music',
    date: '2026-07-15',
    time: '18:00',
    location: 'Waterfront Park',
    address: '1600 Abbott St, Kelowna, BC V1Y 1A9',
    capacity: 500,
    imageUrl: 'https://images.unsplash.com/photo-1605286232233-e448650f5914?w=1080',
    organizerId: 'user_admin',
    organizerName: 'Kelowna Events Committee',
    createdAt: '2026-02-01T10:00:00Z',
    attendees: 245,
    isPublic: true,
  },
  {
    id: 'event_2',
    title: 'Okanagan Wine & Food Pairing',
    description: 'Experience the best of Okanagan Valley wines paired with locally sourced cuisine. Meet winemakers and taste exclusive vintages.',
    category: 'Food & Drink',
    date: '2026-06-20',
    time: '17:30',
    location: 'Mission Hill Winery',
    address: '1730 Mission Hill Rd, West Kelowna, BC V4T 2E4',
    capacity: 60,
    imageUrl: 'https://images.unsplash.com/photo-1593971965381-f00dd2e66211?w=1080',
    organizerId: 'user_2',
    organizerName: 'Okanagan Wine Society',
    createdAt: '2026-01-15T14:30:00Z',
    attendees: 42,
    isPublic: true,
  },
  {
    id: 'event_3',
    title: 'Sunrise Yoga by the Lake',
    description: 'Start your day with peaceful yoga sessions overlooking beautiful Okanagan Lake. All levels welcome.',
    category: 'Sports & Fitness',
    date: '2026-06-28',
    time: '06:30',
    location: 'Rotary Beach Park',
    address: '3600 Lakeshore Rd, Kelowna, BC V1W 3L4',
    capacity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1595981767862-0ea01651c50f?w=1080',
    organizerId: 'user_3',
    organizerName: 'Sarah Mitchell',
    createdAt: '2026-02-10T09:00:00Z',
    attendees: 18,
    isPublic: true,
  },
  {
    id: 'event_4',
    title: 'Kelowna Farmers Market Opening Day',
    description: 'Celebrate the opening day of the 2026 farmers market season! Shop fresh local produce, handmade crafts, and artisan products.',
    category: 'Community',
    date: '2026-04-12',
    time: '08:00',
    location: 'Kelowna Farmers Market',
    address: '1700 Springfield Rd, Kelowna, BC V1Y 5V5',
    capacity: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1747503331142-27f458a1498c?w=1080',
    organizerId: 'user_admin',
    organizerName: 'Kelowna Events Committee',
    createdAt: '2026-01-20T11:00:00Z',
    attendees: 567,
    isPublic: true,
  },
  {
    id: 'event_5',
    title: 'Tech Startup Networking Mixer',
    description: 'Connect with entrepreneurs, developers, and innovators in the Okanagan tech scene. Complimentary drinks and appetizers provided.',
    category: 'Technology',
    date: '2026-05-08',
    time: '18:00',
    location: 'Innovation Centre',
    address: '459 Bernard Ave, Kelowna, BC V1Y 6N7',
    capacity: 80,
    imageUrl: 'https://images.unsplash.com/photo-1623121608226-ca93dec4d94e?w=1080',
    organizerId: 'user_4',
    organizerName: 'Okanagan Tech Alliance',
    createdAt: '2026-02-05T16:00:00Z',
    attendees: 63,
    isPublic: true,
  },
];

app.use(cors());
app.use(express.json());

// Load users from file, or return empty array
function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

// Save users to file
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// POST /api/auth/signup
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  const users = loadUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
  }

  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    password, // NOTE: storing plain text — hash before production use
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  const { password: _pw, ...userWithoutPassword } = newUser;
  return res.status(201).json({ success: true, user: userWithoutPassword });
});

// POST /api/auth/signin
app.post('/api/auth/signin', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const users = loadUsers();
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const { password: _pw, ...userWithoutPassword } = user;
  return res.json({ success: true, user: userWithoutPassword });
});

// GET /api/events — all events
app.get('/api/events', (_req, res) => {
  res.json(events);
});

// GET /api/events/search?q=...&category=...
app.get('/api/events/search', (req, res) => {
  const { q = '', category = '' } = req.query;
  let results = events;

  if (category && category !== 'all') {
    results = results.filter(e => e.category.toLowerCase() === category.toLowerCase());
  }

  if (q.trim()) {
    const lower = q.toLowerCase();
    results = results.filter(e =>
      e.title.toLowerCase().includes(lower) ||
      e.description.toLowerCase().includes(lower) ||
      e.location.toLowerCase().includes(lower) ||
      e.category.toLowerCase().includes(lower)
    );
  }

  res.json(results);
});

// GET /api/events/:id — single event
app.get('/api/events/:id', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
});

// POST /api/events — create event
app.post('/api/events', (req, res) => {
  const newEvent = {
    ...req.body,
    id: `event_${Date.now()}`,
    createdAt: new Date().toISOString(),
    attendees: 0,
  };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

// PUT /api/events/:id — update event
app.put('/api/events/:id', (req, res) => {
  const index = events.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Event not found' });
  events[index] = { ...events[index], ...req.body };
  res.json(events[index]);
});

// DELETE /api/events/:id — delete event
app.delete('/api/events/:id', (req, res) => {
  const index = events.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Event not found' });
  events.splice(index, 1);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
