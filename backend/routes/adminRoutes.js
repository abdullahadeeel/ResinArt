const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/user');
const Seller = require('../models/Seller');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');
const { 
    getDashboardStats,
    getAdminOverviewReport,
    getSellerPerformanceReport,
    getSellerDetails        // ✅ ADDED
} = require('../controllers/admincontroller');
const multer = require('multer');
const path = require('path');

// ==================== MULTER SETUP ====================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'admin-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed'));
    }
});

// ==================== ADMIN AUTH ====================

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Admin already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: admin._id, role: 'admin' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone || '',
                profilePicture: admin.profilePicture || '',
                role: 'admin',
                token
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            { id: admin._id, role: 'admin' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone || '',
                profilePicture: admin.profilePicture || '',
                role: 'admin',
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==================== ADMIN PROFILE ====================

router.get('/profile', protect, admin, async (req, res) => {
    try {
        const adminUser = await Admin.findById(req.user._id).select('-password');
        if (!adminUser) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        res.json({
            success: true,
            data: adminUser
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.put('/profile', protect, admin, async (req, res) => {
    try {
        const { name, phone, profilePicture } = req.body;
        
        const adminUser = await Admin.findById(req.user._id);
        if (!adminUser) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        
        if (name) adminUser.name = name;
        if (phone) adminUser.phone = phone;
        if (profilePicture) adminUser.profilePicture = profilePicture;
        
        await adminUser.save();
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                _id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
                phone: adminUser.phone,
                profilePicture: adminUser.profilePicture,
                role: adminUser.role
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.put('/change-password', protect, admin, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const adminUser = await Admin.findById(req.user._id);
        if (!adminUser) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        
        const isMatch = await bcrypt.compare(currentPassword, adminUser.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        adminUser.password = hashedPassword;
        await adminUser.save();
        
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/upload-profile-picture', protect, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }
        
        const imageUrl = `/uploads/${req.file.filename}`;
        
        const adminUser = await Admin.findByIdAndUpdate(
            req.user._id,
            { profilePicture: imageUrl },
            { new: true }
        ).select('-password');
        
        res.json({
            success: true,
            message: 'Profile picture uploaded',
            data: { imageUrl }
        });
    } catch (error) {
        console.error('Upload profile picture error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==================== DASHBOARD ====================

router.get('/dashboard', protect, admin, getDashboardStats);

// ==================== USER MANAGEMENT ====================

router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.put('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.phone = req.body.phone || user.phone;
        
        await user.save();
        
        res.json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.delete('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin users'
            });
        }
        
        await user.deleteOne();
        
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==================== SELLER MANAGEMENT ====================

router.get('/sellers', protect, admin, async (req, res) => {
    try {
        const sellers = await Seller.find({})
            .select('-password')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: sellers
        });
    } catch (error) {
        console.error('Get sellers error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ✅ FIXED: Using controller for seller details
router.get('/sellers/:id', protect, admin, getSellerDetails);

router.put('/sellers/:id/approve', protect, admin, async (req, res) => {
    try {
        const seller = await Seller.findById(req.params.id);
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }
        
        seller.isApproved = true;
        await seller.save();
        
        res.json({
            success: true,
            message: 'Seller approved successfully',
            data: seller
        });
    } catch (error) {
        console.error('Approve seller error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.put('/sellers/:id/reject', protect, admin, async (req, res) => {
    try {
        const seller = await Seller.findById(req.params.id);
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }
        
        seller.isApproved = false;
        await seller.save();
        
        res.json({
            success: true,
            message: 'Seller rejected',
            data: seller
        });
    } catch (error) {
        console.error('Reject seller error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.delete('/sellers/:id', protect, admin, async (req, res) => {
    try {
        const seller = await Seller.findById(req.params.id);
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }
        
        await Product.deleteMany({ sellerId: seller._id });
        await seller.deleteOne();
        
        res.json({
            success: true,
            message: 'Seller and products deleted successfully'
        });
    } catch (error) {
        console.error('Delete seller error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==================== PRODUCT MANAGEMENT ====================

router.get('/products', protect, admin, async (req, res) => {
    try {
        const products = await Product.find({})
            .populate('sellerId', 'name shopName')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.put('/products/:id/approve', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        product.isApproved = true;
        await product.save();
        
        res.json({
            success: true,
            message: 'Product approved successfully',
            data: product
        });
    } catch (error) {
        console.error('Approve product error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.put('/products/:id/reject', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        product.isApproved = false;
        await product.save();
        
        res.json({
            success: true,
            message: 'Product rejected',
            data: product
        });
    } catch (error) {
        console.error('Reject product error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.put('/products/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );
        
        res.json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.delete('/products/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        await product.deleteOne();
        
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==================== ORDER MANAGEMENT ====================

router.get('/orders', protect, admin, async (req, res) => {
    try {
        const { status, sellerId, limit = 100 } = req.query;
        
        let query = {};
        if (status && status !== 'all') {
            query.orderStatus = status;
        }
        if (sellerId) {
            query.sellerId = sellerId;
        }
        
        const orders = await Order.find(query)
            .populate('user', 'name email phone')
            .populate('sellerId', 'name shopName')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));
        
        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/orders/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('sellerId', 'name shopName');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/orders/:id/note', protect, admin, async (req, res) => {
    try {
        const { note } = req.body;
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        order.adminNotes = order.adminNotes || [];
        order.adminNotes.push({
            note: note,
            addedBy: req.user._id,
            addedAt: new Date()
        });
        await order.save();
        
        res.json({
            success: true,
            message: 'Note added successfully'
        });
    } catch (error) {
        console.error('Add note error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==================== REPORTS ====================

router.get('/reports/overview', protect, admin, getAdminOverviewReport);
router.get('/reports/sellers', protect, admin, getSellerPerformanceReport);

module.exports = router;