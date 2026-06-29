// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getUserOrders,
    getSellerOrders,
    checkOrderInventory,
    trackOrderByNumber,
    addTcsTracking
} = require('../controllers/orderController');

// ✅ Simple role checker middleware (instead of authorize)
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        next();
    };
};

// ==================== PUBLIC ROUTES ====================
router.get('/track/:orderNumber', trackOrderByNumber);

// ==================== USER ROUTES ====================
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.post('/check-inventory', protect, checkOrderInventory);

// ==================== SELLER ROUTES ====================
router.get('/seller', protect, checkRole(['seller']), getSellerOrders);
router.put('/:id/tracking', protect, checkRole(['seller']), addTcsTracking);

// ==================== ADMIN ROUTES ====================
router.get('/', protect, checkRole(['admin']), getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;