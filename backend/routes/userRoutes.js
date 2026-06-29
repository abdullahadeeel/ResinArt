const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const User = require('../models/user');
const Product = require('../models/Product');
const Wishlist = require('../models/Wishlist');
const Order = require('../models/Order');

const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getUserOrders,
    createOrder
} = require('../controllers/userController');

// ==================== MULTER SETUP FOR PROFILE PICTURE ====================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: fileFilter
});

// ==================== PUBLIC ROUTES ====================
router.post('/register', registerUser);
router.post('/login', loginUser);

// ==================== PROTECTED ROUTES ====================
router.use(protect);

// Profile
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

// ✅ PROFILE PICTURE UPLOAD - ADD THIS
router.post('/upload-profile-picture', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const imageUrl = `/uploads/profile/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { profilePicture: imageUrl },
            { new: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'Profile picture updated successfully',
            data: {
                imageUrl: imageUrl
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Orders
router.get('/orders', getUserOrders);
router.post('/orders', createOrder);

// Get single order details
router.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        if (order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to view this order'
            });
        }
        
        res.json({
            success: true,
            order: order
        });
    } catch (error) {
        console.error('Get order details error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==================== WISHLIST ROUTES ====================

// Get wishlist
router.get('/wishlist', async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
        
        if (!wishlist) {
            return res.json({ success: true, data: [] });
        }
        
        res.json({ success: true, data: wishlist.products || [] });
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Add to wishlist
router.post('/wishlist/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        let wishlist = await Wishlist.findOne({ user: req.user._id });
        
        if (!wishlist) {
            wishlist = new Wishlist({ 
                user: req.user._id, 
                products: [] 
            });
        }
        
        if (!wishlist.products) {
            wishlist.products = [];
        }
        
        if (wishlist.products.some(id => id.toString() === productId)) {
            return res.status(400).json({
                success: false,
                message: 'Already in wishlist'
            });
        }
        
        wishlist.products.push(productId);
        await wishlist.save();
        
        res.json({
            success: true,
            message: 'Added to wishlist'
        });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Remove from wishlist
router.delete('/wishlist/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const wishlist = await Wishlist.findOne({ user: req.user._id });
        
        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }
        
        wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
        await wishlist.save();
        
        res.json({
            success: true,
            message: 'Removed from wishlist'
        });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;