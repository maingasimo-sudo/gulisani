const express = require('express');
const authMiddleware = require('../middleware/auth');
const { getUserById, updateUserProfile } = require('../models/queries');

const router = express.Router();

// GET MY PROFILE (protected)
router.get('/profile/me', authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        phoneNumber: user.phone_number,
        profilePicture: user.profile_picture,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// UPDATE PROFILE (protected)
router.put('/profile/update', authMiddleware, async (req, res) => {
  try {
    const { fullName, phoneNumber } = req.body;

    if (!fullName || !phoneNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await updateUserProfile(req.userId, fullName, phoneNumber);

    const user = await getUserById(req.userId);

    res.json({
      message: 'Profile updated',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        phoneNumber: user.phone_number,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET PUBLIC SELLER PROFILE
router.get('/:userId/public', async (req, res) => {
  try {
    const user = await getUserById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      seller: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        profilePicture: user.profile_picture,
      },
    });
  } catch (error) {
    console.error('Get seller profile error:', error);
    res.status(500).json({ error: 'Failed to fetch seller profile' });
  }
});

module.exports = router;