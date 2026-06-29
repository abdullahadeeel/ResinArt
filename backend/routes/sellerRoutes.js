// backend/routes/sellerRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { seller } = require('../middleware/authMiddleware');
const { uploadSellerProductImages, uploadSellerProductImagesUpdate, handleUploadError } = require('../middleware/uploadMiddleware');
const {
    registerSeller,
    loginSeller,
    getSellerDashboard,
    getSellerEarnings,
    getSellerProducts,
    createSellerProduct,
    updateSellerProduct,
    deleteSellerProduct,
    getSellerOrders,
    updateSellerOrderStatus,
    getSellerProfile,
    updateSellerProfile,
    addSellerTcsTracking,
    processSellerRefund,
    getSellerSalesReport,
    getSellerEarningsReport
} = require('../controllers/sellerController');

// ==================== PUBLIC ROUTES ====================
router.post('/register', registerSeller);
router.post('/login', loginSeller);

router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Seller routes are working!',
        timestamp: new Date().toISOString()
    });
});

// ==================== PROTECTED ROUTES ====================
router.use(protect);
router.use(seller);

// Dashboard & Earnings
router.get('/dashboard', getSellerDashboard);
router.get('/earnings', getSellerEarnings);

// ==================== PRODUCT MANAGEMENT ====================
router.get('/products', getSellerProducts);
router.post('/products', uploadSellerProductImages, handleUploadError, createSellerProduct);
router.put('/products/:id', uploadSellerProductImagesUpdate, handleUploadError, updateSellerProduct);
router.delete('/products/:id', deleteSellerProduct);

// ==================== ORDER MANAGEMENT ====================
router.get('/orders', getSellerOrders);
router.put('/orders/:id/status', updateSellerOrderStatus);
router.put('/orders/:id/tracking', addSellerTcsTracking);  // ✅ NEW: Add TCS tracking
router.put('/orders/:id/refund', processSellerRefund);      // ✅ NEW: Process refund

// ==================== REPORTS (Seller) ====================
router.get('/reports/sales', getSellerSalesReport);        // ✅ NEW: Sales report
router.get('/reports/earnings', getSellerEarningsReport);  // ✅ NEW: Earnings report

// Profile
router.get('/profile', getSellerProfile);
router.put('/profile', updateSellerProfile);

module.exports = router;