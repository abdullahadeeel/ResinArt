const Review = require('../models/Review');

// @desc    Get all reviews for Home page
// @route   GET /api/reviews
// @access  Public
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ isApproved: true })
            .sort({ createdAt: -1 })
            .limit(6);
        
        res.json({ success: true, data: reviews });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get featured reviews (for Home page)
// @route   GET /api/reviews/featured
// @access  Public
const getFeaturedReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ isApproved: true, rating: { $gte: 4 } })
            .sort({ createdAt: -1 })
            .limit(4);
        
        res.json({ success: true, data: reviews });
    } catch (error) {
        console.error('Get featured reviews error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private (User must be logged in)
const createReview = async (req, res) => {
    try {
        const { rating, comment, productId } = req.body;
        
        if (!rating || !comment) {
            return res.status(400).json({ success: false, message: 'Rating and comment are required' });
        }
        
        const review = await Review.create({
            user: req.user._id,
            userName: req.user.name,
            userLocation: req.user.city || 'Pakistan',
            rating: rating,
            comment: comment,
            product: productId || null,
            isApproved: true
        });
        
        res.status(201).json({ 
            success: true, 
            data: review, 
            message: '✨ Thank you for your review! ✨' 
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete review (Admin only)
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        await review.deleteOne();
        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get product reviews
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ 
            product: req.params.productId,
            isApproved: true 
        }).sort({ createdAt: -1 });
        
        const averageRating = reviews.length > 0 
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
            : 0;
        
        res.json({ 
            success: true, 
            data: reviews,
            averageRating: averageRating,
            totalReviews: reviews.length
        });
    } catch (error) {
        console.error('Get product reviews error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllReviews,
    getFeaturedReviews,
    createReview,
    deleteReview,
    getProductReviews
};