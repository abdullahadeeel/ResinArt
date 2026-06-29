const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userAvatar: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    comment: {
        type: String,
        required: true,
        maxlength: 1000
    },
    images: [{
        type: String
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    helpful: {
        type: Number,
        default: 0
    },
    isApproved: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// ✅ Check if model already exists before creating
module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);