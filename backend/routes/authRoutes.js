const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Admin = require('../models/Admin');
const Seller = require('../models/Seller');

// ✅ IMPORT authMiddleware
const { authMiddleware } = require('../middleware/authMiddleware');

// ✅ IMPORT getCurrentUser from authController
const { getCurrentUser } = require('../controllers/authcontroller');

// ==================== USER ROUTES ====================

// @desc    Register user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        const token = jwt.sign(
            { id: user._id, role: 'user' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || 'user',
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Login user
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            { id: user._id, role: 'user' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || 'user',
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==================== ADMIN ROUTES ====================

// @desc    Login Admin
// @route   POST /api/auth/admin/login
router.post('/admin/login', async (req, res) => {
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
            message: 'Admin login successful',
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: 'admin',
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==================== SELLER ROUTES ====================

// @desc    Login Seller
// @route   POST /api/auth/seller/login
router.post('/seller/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        if (!seller.isApproved) {
            return res.status(403).json({
                success: false,
                message: 'Account pending admin approval'
            });
        }

        const token = jwt.sign(
            { id: seller._id, role: 'seller' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            message: 'Seller login successful',
            data: {
                _id: seller._id,
                name: seller.name,
                email: seller.email,
                shopName: seller.shopName,
                role: 'seller',
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==================== PROTECTED ROUTES ====================

//  GET current logged in user
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;