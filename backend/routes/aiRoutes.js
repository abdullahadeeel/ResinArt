const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const AIDesign = require('../models/AIDesign');
const Product = require('../models/Product');

const categoryMap = {
    coaster: 'Coasters',
    keychain: 'Other',
    jewelry: 'Jewelry',
    tray: 'Trays',
    namplate: 'Nameplates',
    'home-decor': 'Home Decor',
    gifts: 'Gifts'
};

// @desc    Save AI Design
// @route   POST /api/ai/save
router.post('/save', protect, async (req, res) => {
    try {
        const {
            name, imageUrl, price, description,
            style, productType, shape, size, finish, theme, colorTheme
        } = req.body;

        const design = await AIDesign.create({
            user: req.user._id,
            name: name || 'Custom AI Design',
            imageUrl: imageUrl,
            price: price || 0,
            description: description || '',
            style: style || 'natural',
            productType: productType || 'coaster',
            shape: shape || 'round',
            size: size || 'medium',
            finish: finish || 'glossy',
            theme: theme || 'floral',
            colorTheme: colorTheme || '#b76e79'
        });

        res.json({
            success: true,
            message: 'Design saved successfully',
            data: design
        });
    } catch (error) {
        console.error('Save design error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Get User's Saved Designs
// @route   GET /api/ai/designs
router.get('/designs', protect, async (req, res) => {
    try {
        const designs = await AIDesign.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: designs
        });
    } catch (error) {
        console.error('Get designs error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Delete Design
// @route   DELETE /api/ai/designs/:id
router.delete('/designs/:id', protect, async (req, res) => {
    try {
        const design = await AIDesign.findOne({
            _id: req.params.id,
            user: req.user._id
        });
        
        if (!design) {
            return res.status(404).json({
                success: false,
                message: 'Design not found'
            });
        }
        
        await design.deleteOne();
        
        res.json({
            success: true,
            message: 'Design deleted successfully'
        });
    } catch (error) {
        console.error('Delete design error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Create a Product from AI generated design
// @route   POST /api/ai/create-product
router.post('/create-product', protect, async (req, res) => {
    try {
        const {
            name, imageUrl, price, description,
            productType, style, shape, size, finish, theme, colorTheme
        } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }

        const product = await Product.create({
            name: name || 'Custom AI Design',
            description: description || `AI generated ${productType || 'resin art'} design`,
            price: Number(price) || 2999,
            category: categoryMap[productType] || 'Other',
            images: [imageUrl],
            stock: 1,
            isActive: true,
            isApproved: true,
            sellerName: 'ResinArt'
        });

        res.status(201).json({
            success: true,
            message: 'Product created from AI design',
            product: product
        });
    } catch (error) {
        console.error('Create product from AI error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;