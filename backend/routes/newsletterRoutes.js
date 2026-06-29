const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        
        // Check if already subscribed
        const existing = await Newsletter.findOne({ email });
        if (existing) {
            if (existing.status === 'active') {
                return res.status(400).json({ success: false, message: 'Email already subscribed!' });
            } else {
                existing.status = 'active';
                await existing.save();
                return res.json({ success: true, message: 'Welcome back! You have been resubscribed.' });
            }
        }
        
        // New subscription
        await Newsletter.create({ email });
        
        // TODO: Send welcome email here
        
        res.json({ success: true, message: '✨ Subscribed successfully! Check your email for updates. ✨' });
    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Unsubscribe from newsletter
// @route   PUT /api/newsletter/unsubscribe
// @access  Public
router.put('/unsubscribe', async (req, res) => {
    try {
        const { email } = req.body;
        await Newsletter.findOneAndUpdate({ email }, { status: 'unsubscribed' });
        res.json({ success: true, message: 'Unsubscribed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Get all subscribers (Admin only)
// @route   GET /api/newsletter/subscribers
// @access  Private/Admin
router.get('/subscribers', protect, admin, async (req, res) => {
    try {
        const subscribers = await Newsletter.find({ status: 'active' }).sort({ subscribedAt: -1 });
        res.json({ success: true, count: subscribers.length, data: subscribers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Send newsletter to all subscribers (Admin only)
// @route   POST /api/newsletter/send
// @access  Private/Admin
router.post('/send', protect, admin, async (req, res) => {
    try {
        const { subject, message } = req.body;
        const subscribers = await Newsletter.find({ status: 'active' });
        
        // TODO: Implement email sending logic here
        // For now, just log
        console.log(`Sending "${subject}" to ${subscribers.length} subscribers`);
        
        res.json({ success: true, message: `Newsletter sent to ${subscribers.length} subscribers` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;