// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Seller = require('../models/Seller');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log('🔐 Verifying token...');
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
            console.log('✅ Token verified, ID:', decoded.id, 'Role:', decoded.role);
            
            let user = null;
            
            if (decoded.role === 'seller') {
                user = await Seller.findById(decoded.id).select('-password');
                if (user) {
                    user.role = 'seller';
                    console.log('✅ Seller found, role set to:', user.role);
                }
            } else if (decoded.role === 'admin') {
                user = await Admin.findById(decoded.id).select('-password');
                if (user) {
                    user.role = 'admin';
                    console.log('✅ Admin found, role set to:', user.role);
                }
            } else {
                user = await User.findById(decoded.id).select('-password');
                if (user) {
                    user.role = user.role || 'user';
                    console.log('✅ User found, role set to:', user.role);
                }
            }
            
            if (!user) {
                console.log('❌ User not found');
                return res.status(401).json({ success: false, message: 'User not found' });
            }
            
            console.log('✅ User found, role:', user.role);
            req.user = user;
            next();
        } catch (error) {
            console.error('❌ Token verification failed:', error.message);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    } else {
        console.log('❌ No token provided');
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    console.log('🔐 Admin Middleware - User role:', req.user?.role);
    if (req.user && req.user.role === 'admin') {
        console.log('✅ Admin access granted');
        next();
    } else {
        console.log('❌ Admin access denied');
        res.status(403).json({ success: false, message: 'Not authorized as admin' });
    }
};

const seller = (req, res, next) => {
    console.log('🔐 Seller Middleware - User role:', req.user?.role);
    console.log('🔐 Seller Middleware - User email:', req.user?.email);
    
    if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
        console.log('✅ Seller access granted');
        next();
    } else {
        console.log('❌ Seller access denied, role:', req.user?.role);
        res.status(403).json({ success: false, message: 'Seller access required' });
    }
};

// Authorize specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `Access denied. ${req.user.role} is not authorized.`
            });
        }
        
        next();
    };
};


module.exports = { protect , authMiddleware: protect, admin, seller, authorize };