const express = require('express');
const cors = require('cors');
const path = require('path');
try {
  require('dotenv').config();
} catch (err) {
  // .env file not found, using environment variables from Hostinger
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const listingsRoutes = require('./routes/listings');
const bumpsRoutes = require('./routes/bumps');
const contactsRoutes = require('./routes/contacts');
const paymentsRoutes = require('./routes/payments');
const usersRoutes = require('./routes/users');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Gulisani backend is running!' });
});

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/bumps', bumpsRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/users', usersRoutes);

// Serve React frontend in production
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Gulisani server running on http://localhost:${PORT}`);
});