const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  createPayment,
  getPaymentById,
  updatePaymentStatus,
} = require('../models/queries');

const router = express.Router();

// CREATE PAYMENT (protected)
router.post('/initiate', authMiddleware, async (req, res) => {
  try {
    const { feature, amount, subscriptionType } = req.body;
    const userId = req.userId;

    if (!feature || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Valid features: 'bump' or 'contact_reveal'
    if (!['bump', 'contact_reveal'].includes(feature)) {
      return res.status(400).json({ error: 'Invalid feature' });
    }

    const userType = feature === 'bump' ? 'seller' : 'buyer';

    // Create payment record with 'pending' status
    const payment = await createPayment(
      userId,
      userType,
      feature,
      amount,
      subscriptionType,
      'pending',
      'pending'
    );

    res.status(201).json({
      message: 'Payment initiated',
      paymentId: payment.insertId,
      amount,
      feature,
      // In production, you'd integrate with Pesapal/Flutterwave here
      // and return checkout URL
    });
  } catch (error) {
    console.error('Initiate payment error:', error);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// GET PAYMENT STATUS (protected)
router.get('/:paymentId', authMiddleware, async (req, res) => {
  try {
    const payment = await getPaymentById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Only allow user to view their own payments
    if (payment.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        feature: payment.feature,
        createdAt: payment.created_at,
        completedAt: payment.completed_at,
      },
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// WEBHOOK - Payment Provider Confirmation (for Pesapal/Flutterwave)
// In production, this would be called by the payment provider
router.post('/webhook/confirm', async (req, res) => {
  try {
    const { paymentId, status, transactionRef } = req.body;

    if (!paymentId || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate webhook signature in production
    // For now, just update the payment status

    await updatePaymentStatus(paymentId, status, transactionRef);

    res.json({ message: 'Payment status updated' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;