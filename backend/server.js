const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path'); 

dotenv.config();
const connectDB = require('./config/db');
connectDB();

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const settingsRoutes = require('./routes/SettingsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const aiRoutes = require('./routes/aiRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const reorderRoutes = require('./routes/reorderRoutes');
const materialRoutes = require('./routes/materialRoutes');
const sellerInventoryRoutes = require('./routes/sellerInventoryRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const imageRoutes = require('./routes/imageRoutes');



const app = express();

// ==================== MIDDLEWARE ====================
app.use(cors());

// ✅ UPDATED: Increased limit from 10mb to 15mb (Code 2 feature)
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging middleware
app.use((req, res, next) => {
    console.log(`🌐 ${req.method} ${req.url}`);
    next();
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'API is working' });
});

// ==================== API ROUTES ====================
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reviews', require('./routes/productReviewRoutes'));
app.use('/api/inventory', inventoryRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/reorder', reorderRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/seller/inventory', sellerInventoryRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/images', imageRoutes);


console.log('\n' + '='.repeat(60));
console.log('🚀 REGISTERED ENDPOINTS:');
console.log('📍 /api/test');
console.log('📍 /api/auth/*');
console.log('📍 /api/admin/*');
console.log('📍 /api/products/*');
console.log('📍 /api/orders/*');
console.log('📍 /api/users/*');
console.log('📍 /api/settings/*');
console.log('📍 /api/dashboard/*');
console.log('📍 /api/seller/*');
console.log('📍 /api/ai/*');
console.log('📍 /api/reviews/*');
console.log('📍 /api/inventory/*');
console.log('📍 /api/recipes/*');
console.log('📍 /api/reorder/*');
console.log('📍 /api/materials/*');
console.log('📍 /api/seller/inventory/*');
console.log('📍 /api/newsletter/*');
console.log('📍 /api/images/*');        // ✅ ADDED: Code 2 feature
console.log('📍 /uploads/* (Static files)');
console.log('='.repeat(60) + '\n');

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.url
    });
});

// Error handler with specific handling for payload too large
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    
    // ✅ UPDATED: Increased limit message from 10MB to 15MB (Code 2 feature)
    if (err.type === 'entity.too.large' || err.message === 'request entity too large') {
        return res.status(413).json({
            success: false,
            message: 'Image too large. Please upload image less than 15MB.'
        });
    }
    
    res.status(500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Test: http://localhost:${PORT}/api/test`);
    console.log(`📍 Images: http://localhost:${PORT}/uploads/`);
});