const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get product reviews
// @route   GET /api/reviews/product/:productId
router.get('/product/:productId', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'newest' } = req.query;
        
        let sortOption = {};
        if (sort === 'newest') sortOption = { createdAt: -1 };
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        if (sort === 'highest') sortOption = { rating: -1 };
        if (sort === 'lowest') sortOption = { rating: 1 };
        if (sort === 'helpful') sortOption = { helpful: -1 };
        
        const reviews = await Review.find({ product: req.params.productId, isApproved: true })
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        
        const total = await Review.countDocuments({ product: req.params.productId, isApproved: true });
        
        // Calculate rating distribution
        const ratingDistribution = {
            5: await Review.countDocuments({ product: req.params.productId, rating: 5 }),
            4: await Review.countDocuments({ product: req.params.productId, rating: 4 }),
            3: await Review.countDocuments({ product: req.params.productId, rating: 3 }),
            2: await Review.countDocuments({ product: req.params.productId, rating: 2 }),
            1: await Review.countDocuments({ product: req.params.productId, rating: 1 })
        };
        
        const avgRating = total > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
            : 0;
        
        res.json({
            success: true,
            data: reviews,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            },
            stats: {
                averageRating: avgRating,
                totalReviews: total,
                ratingDistribution
            }
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Add review
// @route   POST /api/reviews/product/:productId
router.post('/product/:productId', protect, async (req, res) => {
    try {
        const { rating, title, comment } = req.body;
        const productId = req.params.productId;
        
        // Check if user purchased this product
        const hasPurchased = await Order.findOne({
            user: req.user._id,
            'products.product': productId,
            orderStatus: 'delivered'
        });
        
        // Check if user already reviewed
        const existingReview = await Review.findOne({
            product: productId,
            user: req.user._id
        });
        
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }
        
        const review = await Review.create({
            product: productId,
            user: req.user._id,
            userName: req.user.name,
            userAvatar: req.user.profilePicture || '',
            rating: parseInt(rating),
            title,
            comment,
            isVerified: !!hasPurchased
        });
        
        // Update product average rating and review count
        const allReviews = await Review.find({ product: productId, isApproved: true });
        const avgRating = allReviews.length > 0 
            ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length 
            : 0;
        
        await Product.findByIdAndUpdate(productId, {
            averageRating: avgRating.toFixed(1),
            totalReviews: allReviews.length
        });
        
        res.status(201).json({
            success: true,
            message: 'Review added successfully!',
            data: review
        });
    } catch (error) {
        console.error('Add review error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:reviewId/helpful
router.put('/:reviewId/helpful', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        
        review.helpful += 1;
        await review.save();
        
        res.json({ success: true, helpful: review.helpful });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
router.get('/my-reviews', protect, async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .populate('product', 'name images price')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;