const User = require('../models/user');
const Admin = require('../models/Admin');
const Seller = require('../models/Seller');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==================== USER AUTHENTICATION ====================

// @desc    Register User
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone: phone || '',
            address: address || {},
            role: 'user'
        });

        const token = jwt.sign(
            { id: user._id, role: 'user' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );

        // ✅ SEND WELCOME EMAIL - DIRECT
        try {
            const { sendEmailNotification } = require('../utils/notificationService');
            
            const subject = '🎨 Welcome to ResinArt by Komal Zahra!';
            const html = `
                <h2>Welcome to the ResinArt Family! 🎉</h2>
                <p>Hi <strong>${user.name}</strong>,</p>
                <p>Thank you for joining ResinArt by Komal Zahra.</p>
                <p>We're so excited to have you here!</p>
                <br>
                <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/shop">Start Shopping →</a></p>
                <br>
                <p>💖 Team ResinArt</p>
            `;
            
            await sendEmailNotification(user.email, subject, html);
            console.log('✅ Welcome email sent to:', user.email);
        } catch (emailError) {
            console.error('❌ Welcome email error:', emailError.message);
        }

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: 'user',
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
};

// @desc    Login User
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
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
                role: 'user',
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
};

// ==================== ADMIN AUTHENTICATION ====================

// @desc    Register Admin
// @route   POST /api/admin/register
const registerAdmin = async (req, res) => {
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
            password: hashedPassword,
            role: 'admin'
        });

        const token = jwt.sign(
            { id: admin._id, role: 'admin' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: 'admin',
                token
            }
        });
    } catch (error) {
        console.error('Admin register error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Login Admin
// @route   POST /api/admin/login
const loginAdmin = async (req, res) => {
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
                role: 'admin',
                token
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== SELLER AUTHENTICATION ====================

// @desc    Register Seller
// @route   POST /api/seller/register
const registerSeller = async (req, res) => {
    try {
        const { name, email, password, shopName, phone, address } = req.body;

        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({
                success: false,
                message: 'Seller already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const seller = await Seller.create({
            name,
            email,
            password: hashedPassword,
            shopName,
            phone: phone || '',
            address: address || {},
            role: 'seller',
            isApproved: false
        });

        const token = jwt.sign(
            { id: seller._id, role: 'seller' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            message: 'Seller registered successfully. Waiting for admin approval.',
            data: {
                _id: seller._id,
                name: seller.name,
                email: seller.email,
                shopName: seller.shopName,
                role: 'seller',
                isApproved: seller.isApproved,
                token
            }
        });
    } catch (error) {
        console.error('Seller register error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Login Seller
// @route   POST /api/seller/login
const loginSeller = async (req, res) => {
    try {
        const { email, password } = req.body;

        const seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (!seller.isApproved) {
            return res.status(403).json({ success: false, message: 'Account pending approval' });
        }

        const token = jwt.sign(
            { id: seller._id, role: 'seller' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            data: {
                _id: seller._id,
                name: seller.name,
                email: seller.email,
                shopName: seller.shopName,
                role: 'seller',
                isApproved: seller.isApproved,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== GET CURRENT USER ====================

// @desc    Get current logged in user
// @route   GET /api/auth/me
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        
        let user = null;
        
        if (userRole === 'admin') {
            user = await Admin.findById(userId).select('-password');
        } else if (userRole === 'seller') {
            user = await Seller.findById(userId).select('-password');
        } else {
            user = await User.findById(userId).select('-password');
        }
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: userRole,
                phone: user.phone || '',
                shopName: user.shopName || '',
                isApproved: user.isApproved !== undefined ? user.isApproved : true
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== EXPORTS ====================
module.exports = {
    registerUser,
    loginUser,
    registerAdmin,
    loginAdmin,
    registerSeller,
    loginSeller,
    getCurrentUser
};