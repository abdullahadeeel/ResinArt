const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getAllReviews,
    getFeaturedReviews,
    createReview,
    deleteReview,
    getProductReviews
} = require('../controllers/reviewController');

// Public routes
router.get('/', getAllReviews);
router.get('/featured', getFeaturedReviews);
router.get('/product/:productId', getProductReviews);

// Private routes (user must be logged in)
router.post('/', protect, createReview);

// Admin routes
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;