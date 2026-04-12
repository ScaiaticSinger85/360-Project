require('dotenv').config();

const bcrypt = require('bcryptjs');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { connectToDatabase, getCollections } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

app.use('/api/*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'Uploaded image is too large. Please use a file under 5MB.',
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Request failed.',
    });
  }

  return next();
});

const PORT = process.env.PORT || 4000;

async function ensureAdminUser() {
  const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const adminPassword = String(process.env.ADMIN_PASSWORD || '').trim();

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be defined in server/.env');
  }

  const { usersCollection } = getCollections();
  const existingAdmin = await usersCollection.findOne({ email: adminEmail });
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  if (!existingAdmin) {
    await usersCollection.insertOne({
      name: 'TA Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      bio: 'Administrative account',
      avatar: '',
      isActive: true,
      rsvpEventIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return;
  }

  await usersCollection.updateOne(
    { _id: existingAdmin._id },
    {
      $set: {
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
    }
  );
}

connectToDatabase()
  .then(async () => {
    await ensureAdminUser();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
  });
