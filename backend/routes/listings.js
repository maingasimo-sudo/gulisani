const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  createListing,
  getListings,
  getListingById,
  getListingsBySeller,
  updateListing,
  deleteListing,
  getActiveBump,
} = require('../models/queries');

const router = express.Router();

// CREATE LISTING (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, category, price, imageUrl, location } = req.body;
    const sellerId = req.userId;

    if (!title || !category || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await createListing(
      sellerId,
      title,
      description,
      category,
      price,
      imageUrl,
      location
    );

    res.status(201).json({
      message: 'Listing created',
      listingId: result.insertId,
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// GET ALL LISTINGS (with search & filter)
router.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0, category, search } = req.query;

    const listings = await getListings(
      parseInt(limit),
      parseInt(offset),
      category,
      search
    );

    res.json({ listings });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// GET SINGLE LISTING
router.get('/:id', async (req, res) => {
  try {
    const listing = await getListingById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Check if bumped
    const activeBump = await getActiveBump(listing.id);
    listing.isBumped = !!activeBump;

    res.json({ listing });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

// GET MY LISTINGS (protected)
router.get('/user/my-listings', authMiddleware, async (req, res) => {
  try {
    const listings = await getListingsBySeller(req.userId);
    res.json({ listings });
  } catch (error) {
    console.error('Get my listings error:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// UPDATE LISTING (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, category, price, imageUrl, location } = req.body;
    const listingId = req.params.id;

    const listing = await getListingById(listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.seller_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await updateListing(listingId, title, description, category, price, imageUrl, location);

    res.json({ message: 'Listing updated' });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// DELETE LISTING (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const listingId = req.params.id;

    const listing = await getListingById(listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.seller_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await deleteListing(listingId);

    res.json({ message: 'Listing deleted' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

module.exports = router;