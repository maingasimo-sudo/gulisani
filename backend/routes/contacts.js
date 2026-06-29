const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  createContactAccess,
  hasContactAccess,
  getSellerContact,
  createPayment,
  getListingById,
} = require('../models/queries');

const router = express.Router();

// CONTACT PRICING
const CONTACT_PRICES = {
  weekly: 75,
  biweekly: 120,
  monthly: 200,
};

const CONTACT_DURATION = {
  weekly: 7,
  biweekly: 14,
  monthly: 30,
};

// PURCHASE CONTACT ACCESS (protected)
router.post('/purchase', authMiddleware, async (req, res) => {
  try {
    const { subscriptionType, autoRenew = false } = req.body;
    const buyerId = req.userId;

    if (!subscriptionType) {
      return res.status(400).json({ error: 'Missing subscription type' });
    }

    if (!CONTACT_PRICES[subscriptionType]) {
      return res.status(400).json({ error: 'Invalid subscription type' });
    }

    const amount = CONTACT_PRICES[subscriptionType];
    const days = CONTACT_DURATION[subscriptionType];
    const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    // Create payment record
    const payment = await createPayment(
      buyerId,
      'buyer',
      'contact_reveal',
      amount,
      subscriptionType,
      'pending',
      'pending'
    );

    // Create contact access
    const access = await createContactAccess(
      buyerId,
      subscriptionType,
      amount,
      expiryDate,
      autoRenew
    );

    res.status(201).json({
      message: 'Contact access purchased',
      accessId: access.insertId,
      paymentId: payment.insertId,
      amount,
      subscriptionType,
      expiryDate,
    });
  } catch (error) {
    console.error('Purchase contact access error:', error);
    res.status(500).json({ error: 'Failed to purchase contact access' });
  }
});

// GET SELLER CONTACT (protected)
router.get('/seller/:sellerId', authMiddleware, async (req, res) => {
  try {
    const buyerId = req.userId;
    const sellerId = req.params.sellerId;

    // Check if buyer has access
    const hasAccess = await hasContactAccess(buyerId);

    if (!hasAccess) {
      return res.status(403).json({
        error: 'You need to purchase contact access',
        requiresPurchase: true,
        prices: CONTACT_PRICES,
      });
    }

    // Get seller contact
    const contact = await getSellerContact(sellerId);

    if (!contact) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    res.json({
      sellerContact: {
        phone: contact.phone_number,
        email: contact.email,
      },
    });
  } catch (error) {
    console.error('Get seller contact error:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// REVEAL CONTACT ON LISTING (protected)
router.get('/listing/:listingId/seller-contact', authMiddleware, async (req, res) => {
  try {
    const buyerId = req.userId;
    const listingId = req.params.listingId;

    // Get listing to find seller
    const listing = await getListingById(listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const sellerId = listing.seller_id;

    // Check if buyer has access
    const hasAccess = await hasContactAccess(buyerId);

    if (!hasAccess) {
      return res.status(403).json({
        error: 'You need to purchase contact access to view seller contact',
        requiresPurchase: true,
        prices: CONTACT_PRICES,
      });
    }

    // Get seller contact
    const contact = await getSellerContact(sellerId);

    res.json({
      listing: {
        id: listing.id,
        title: listing.title,
      },
      sellerContact: {
        phone: contact.phone_number,
        email: contact.email,
      },
    });
  } catch (error) {
    console.error('Get listing seller contact error:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// CHECK IF HAS ACCESS (protected)
router.get('/check-access', authMiddleware, async (req, res) => {
  try {
    const hasAccess = await hasContactAccess(req.userId);

    res.json({
      hasAccess,
      prices: CONTACT_PRICES,
      durations: CONTACT_DURATION,
    });
  } catch (error) {
    console.error('Check access error:', error);
    res.status(500).json({ error: 'Failed to check access' });
  }
});

module.exports = router;