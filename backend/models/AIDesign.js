const mongoose = require('mongoose');

const aiDesignSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        default: 'Custom AI Design'
    },
    imageUrl: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    style: {
        type: String,
        default: 'natural'
    },
    productType: {
        type: String,
        default: 'coaster'
    },
    shape: {
        type: String,
        default: 'round'
    },
    size: {
        type: String,
        default: 'medium'
    },
    finish: {
        type: String,
        default: 'glossy'
    },
    theme: {
        type: String,
        default: 'floral'
    },
    colorTheme: {
        type: String,
        default: '#b76e79'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AIDesign', aiDesignSchema);