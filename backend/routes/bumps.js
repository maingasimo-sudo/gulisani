const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  createBumpSubscription,
  getActiveBump,
  bumpListing,
  createPayment,
  getListingById,
} = require('../models/queries');

const router = express.Router();

// BUMP PRICING
const BUMP_PRICES = {
  weekly: 50,
  biweekly: 80,
  monthly: 150,
};

const BUMP_DURATION = {
  weekly: 7,
  biweekly: 14,
  monthly: 30,
};

// PURCHASE BUMP (protected)
router.post('/purchase', authMiddleware, async (req, res) => {
  try {
    const { listingId, subscriptionType, autoRenew = false } = req.body;
    const sellerId = req.userId;

    if (!listingId || !subscriptionType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!BUMP_PRICES[subscriptionType]) {
      return res.status(400).json({ error: 'Invalid subscription type' });
    }

    // Check listing ownership
    const listing = await getListingById(listingId);
    if (!listing || listing.seller_id !== sellerId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const amount = BUMP_PRICES[subscriptionType];
    const days = BUMP_DURATION[subscriptionType];
    const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    // Create payment record
    const payment = await createPayment(
      sellerId,
      'seller',
      'bump',
      amount,
      subscriptionType,
      'pending',
      'pending'
    );

    // Create bump subscription
    const bump = await createBumpSubscription(
      sellerId,
      listingId,
      subscriptionType,
      amount,
      expiryDate,
      autoRenew
    );

    // Bump the listing immediately
    await bumpListing(listingId);

    res.status(201).json({
      message: 'Bump created successfully',
      bumpId: bump.insertId,
      paymentId: payment.insertId,
      amount,
      subscriptionType,
      expiryDate,
    });
  } catch (error) {
    console.error('Purchase bump error:', error);
    res.status(500).json({ error: 'Failed to create bump' });
  }
});

// CHECK ACTIVE BUMP
router.get('/status/:listingId', async (req, res) => {
  try {
    const activeBump = await getActiveBump(req.params.listingId);

    if (!activeBump) {
      return res.json({ isBumped: false });
    }

    res.json({
      isBumped: true,
      bump: {
        id: activeBump.id,
        type: activeBump.subscription_type,
        expiryDate: activeBump.expiry_date,
        autoRenew: activeBump.auto_renew,
      },
    });
  } catch (error) {
    console.error('Get bump status error:', error);
    res.status(500).json({ error: 'Failed to fetch bump status' });
  }
});

// GET BUMP PRICES
router.get('/pricing/list', (req, res) => {
  res.json({
    prices: BUMP_PRICES,
    durations: BUMP_DURATION,
  });
});

module.exports = router;