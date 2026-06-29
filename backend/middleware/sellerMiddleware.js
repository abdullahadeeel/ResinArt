const seller = (req, res, next) => {
    console.log('🔐 Seller Middleware - User:', req.user);
    console.log('🔐 Seller Middleware - User role:', req.user?.role);
    
    // Check if user exists and has seller or admin role
    if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
        console.log('✅ Seller Middleware - Access granted');
        next();
    } else {
        console.log('❌ Seller Middleware - Access denied, role:', req.user?.role);
        res.status(403).json({ 
            success: false, 
            message: 'Seller access required' 
        });
    }
};

module.exports = { seller };