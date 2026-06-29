const pool = require('../config/db');

// ============= USER QUERIES =============
const createUser = async (username, email, hashedPassword) => {
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );
  return result;
};

const getUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const getUserById = async (userId) => {
  const [rows] = await pool.query('SELECT id, username, email, full_name, phone_number, profile_picture FROM users WHERE id = ?', [userId]);
  return rows[0];
};

const updateUserProfile = async (userId, fullName, phoneNumber) => {
  const [result] = await pool.query(
    'UPDATE users SET full_name = ?, phone_number = ? WHERE id = ?',
    [fullName, phoneNumber, userId]
  );
  return result;
};

// ============= LISTING QUERIES =============
const createListing = async (sellerId, title, description, category, price, imageUrl, location) => {
  const [result] = await pool.query(
    'INSERT INTO listings (seller_id, title, description, category, price, image_url, location, listing_order) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
    [sellerId, title, description, category, price, imageUrl, location]
  );
  return result;
};

const getListings = async (limit = 50, offset = 0, category = null, searchTerm = null) => {
  let query = 'SELECT * FROM listings WHERE status = "active"';
  let params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (searchTerm) {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    params.push(`%${searchTerm}%`, `%${searchTerm}%`);
  }

  query += ' ORDER BY listing_order DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [rows] = await pool.query(query, params);
  return rows;
};

const getListingById = async (listingId) => {
  const [rows] = await pool.query('SELECT * FROM listings WHERE id = ?', [listingId]);
  return rows[0];
};

const getListingsBySeller = async (sellerId) => {
  const [rows] = await pool.query('SELECT * FROM listings WHERE seller_id = ? ORDER BY created_at DESC', [sellerId]);
  return rows;
};

const updateListing = async (listingId, title, description, category, price, imageUrl, location) => {
  const [result] = await pool.query(
    'UPDATE listings SET title = ?, description = ?, category = ?, price = ?, image_url = ?, location = ?, updated_at = NOW() WHERE id = ?',
    [title, description, category, price, imageUrl, location, listingId]
  );
  return result;
};

const deleteListing = async (listingId) => {
  const [result] = await pool.query('UPDATE listings SET status = "removed" WHERE id = ?', [listingId]);
  return result;
};

// ============= BUMP QUERIES =============
const createBumpSubscription = async (sellerId, listingId, subscriptionType, amountCharged, expiryDate, autoRenew) => {
  const [result] = await pool.query(
    'INSERT INTO bump_subscriptions (seller_id, listing_id, subscription_type, amount_charged, expiry_date, auto_renew, status) VALUES (?, ?, ?, ?, ?, ?, "active")',
    [sellerId, listingId, subscriptionType, amountCharged, expiryDate, autoRenew]
  );
  return result;
};

const getActiveBump = async (listingId) => {
  const [rows] = await pool.query(
    'SELECT * FROM bump_subscriptions WHERE listing_id = ? AND status = "active" AND expiry_date > NOW()',
    [listingId]
  );
  return rows[0];
};

const bumpListing = async (listingId) => {
  const [result] = await pool.query(
    'UPDATE listings SET listing_order = NOW() WHERE id = ?',
    [listingId]
  );
  return result;
};

const expireBump = async (bumpId) => {
  const [result] = await pool.query(
    'UPDATE bump_subscriptions SET status = "expired" WHERE id = ?',
    [bumpId]
  );
  return result;
};

// ============= CONTACT ACCESS QUERIES =============
const createContactAccess = async (buyerId, subscriptionType, amountCharged, expiryDate, autoRenew) => {
  const [result] = await pool.query(
    'INSERT INTO buyer_contact_access (buyer_id, subscription_type, amount_charged, expiry_date, auto_renew, status) VALUES (?, ?, ?, ?, ?, "active")',
    [buyerId, subscriptionType, amountCharged, expiryDate, autoRenew]
  );
  return result;
};

const hasContactAccess = async (buyerId) => {
  const [rows] = await pool.query(
    'SELECT * FROM buyer_contact_access WHERE buyer_id = ? AND status = "active" AND expiry_date > NOW()',
    [buyerId]
  );
  return rows.length > 0;
};

const getSellerContact = async (sellerId) => {
  const [rows] = await pool.query(
    'SELECT phone_number, email FROM users WHERE id = ?',
    [sellerId]
  );
  return rows[0];
};

// ============= PAYMENT QUERIES =============
const createPayment = async (userId, userType, feature, amount, subscriptionType, paymentMethod, status = 'pending') => {
  const [result] = await pool.query(
    'INSERT INTO payments (user_id, user_type, feature, amount, currency, subscription_type, payment_method, status) VALUES (?, ?, ?, ?, "ZMW", ?, ?, ?)',
    [userId, userType, feature, amount, subscriptionType, paymentMethod, status]
  );
  return result;
};

const updatePaymentStatus = async (paymentId, status, transactionRef) => {
  const [result] = await pool.query(
    'UPDATE payments SET status = ?, transaction_ref = ?, completed_at = NOW() WHERE id = ?',
    [status, transactionRef, paymentId]
  );
  return result;
};

const getPaymentById = async (paymentId) => {
  const [rows] = await pool.query('SELECT * FROM payments WHERE id = ?', [paymentId]);
  return rows[0];
};

module.exports = {
  // User
  createUser,
  getUserByEmail,
  getUserById,
  updateUserProfile,
  // Listings
  createListing,
  getListings,
  getListingById,
  getListingsBySeller,
  updateListing,
  deleteListing,
  // Bumps
  createBumpSubscription,
  getActiveBump,
  bumpListing,
  expireBump,
  // Contact Access
  createContactAccess,
  hasContactAccess,
  getSellerContact,
  // Payments
  createPayment,
  updatePaymentStatus,
  getPaymentById,
};