// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadProductImages, uploadProductImagesWithNew, handleUploadError } = require('../middleware/uploadMiddleware');
const Product = require('../models/Product');
const ProductRecipe = require('../models/ProductRecipe');
const RawMaterial = require('../models/RawMaterial');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded images
router.use('/uploads', express.static(uploadDir));

// ==================== PUBLIC ROUTES ====================

// GET all products (active and approved)
router.get('/', async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice } = req.query;
        
        let query = { isActive: true, isApproved: true };
        
        if (category && category !== 'all') {
            query.category = category;
        }
        
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }
        
        const products = await Product.find(query).sort({ createdAt: -1 });
        
        res.json({ 
            success: true, 
            count: products.length,
            data: products 
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET products by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ 
            category, 
            isActive: true, 
            isApproved: true 
        }).sort({ createdAt: -1 });
        
        res.json({ success: true, count: products.length, data: products });
    } catch (error) {
        console.error('Get products by category error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== ADMIN ROUTES ====================

// GET all products (admin - includes all)
router.get('/admin/all', protect, admin, async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.json({ success: true, count: products.length, data: products });
    } catch (error) {
        console.error('Get admin products error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// CREATE product with image upload (Admin)
router.post('/admin', protect, admin, uploadProductImages, handleUploadError, async (req, res) => {
    try {
        console.log('📦 Admin creating product...');
        console.log('📝 req.body:', req.body);
        console.log('📸 req.files:', req.files ? req.files.length : 0);
        
        const { name, description, price, category, stock, isActive } = req.body;
        
        // Validation
        if (!name || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'Name, price and category are required'
            });
        }
        
        // Process uploaded images
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
        }
        
        const now = new Date();
        
        const product = new Product({
            name,
            description: description || '',
            price: Number(price),
            category,
            images: imageUrls,
            stock: Number(stock) || 0,
            isActive: isActive === 'true' || isActive === true,
            isApproved: true,
            sellerName: req.user?.name || 'Admin',
            createdAt: now,
            updatedAt: now,
            hasRecipe: false,
            inventoryTrackingEnabled: false,
            averageRating: 0,
            totalReviews: 0,
            totalMaterialCost: 0,
            profitMargin: 0
        });
        
        await product.save();
        
        console.log('✅ Product created:', product._id);
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: product
        });
        
    } catch (error) {
        console.error('❌ Create product error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// UPDATE product (Admin)
router.put('/admin/:id', protect, admin, uploadProductImagesWithNew, handleUploadError, async (req, res) => {
    try {
        console.log('📝 Admin updating product:', req.params.id);
        
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        const { name, description, price, category, stock, isActive, existingImages } = req.body;
        
        // Parse existing images
        let existingImagesArray = [];
        if (existingImages) {
            try {
                existingImagesArray = typeof existingImages === 'string' 
                    ? JSON.parse(existingImages) 
                    : existingImages;
            } catch (e) {
                existingImagesArray = [];
            }
        } else {
            existingImagesArray = product.images || [];
        }
        
        // Process new images
        let newImageUrls = [];
        if (req.files && req.files.length > 0) {
            newImageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
        }
        
        // Combine images
        const allImages = [...existingImagesArray, ...newImageUrls];
        
        // Update product fields
        product.name = name || product.name;
        product.description = description !== undefined ? description : product.description;
        product.price = price ? Number(price) : product.price;
        product.category = category || product.category;
        product.images = allImages;
        product.stock = stock !== undefined ? Number(stock) : product.stock;
        product.isActive = isActive === 'true' || isActive === true;
        product.updatedAt = new Date();
        
        await product.save();
        
        console.log('✅ Product updated:', product._id);
        
        res.json({
            success: true,
            message: 'Product updated successfully',
            product: product
        });
        
    } catch (error) {
        console.error('❌ Update product error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// DELETE product (Admin)
router.delete('/admin/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        // Delete associated recipe
        await ProductRecipe.findOneAndDelete({ productId: req.params.id });
        
        // Delete product images from server
        for (const imagePath of product.images) {
            const fullPath = path.join(uploadDir, 'products', path.basename(imagePath));
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
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

// ==================== SELLER ROUTES ====================

// GET seller's products
router.get('/seller/my-products', protect, async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, count: products.length, data: products });
    } catch (error) {
        console.error('Get seller products error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// CREATE product (Seller)
router.post('/seller', protect, uploadProductImages, handleUploadError, async (req, res) => {
    try {
        console.log('📦 Seller creating product...');
        console.log('📝 req.body:', req.body);
        console.log('📸 req.files:', req.files ? req.files.length : 0);
        
        const { name, description, price, category, stock, isActive } = req.body;
        
        if (!name || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'Name, price and category are required'
            });
        }
        
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
        }
        
        const now = new Date();
        
        const product = new Product({
            name,
            description: description || '',
            price: Number(price),
            category,
            images: imageUrls,
            stock: Number(stock) || 0,
            isActive: isActive === 'true' || isActive === true,
            isApproved: false,
            sellerId: req.user._id,
            sellerName: req.user.shopName || req.user.name || 'Seller',
            createdAt: now,
            updatedAt: now,
            hasRecipe: false,
            inventoryTrackingEnabled: false,
            averageRating: 0,
            totalReviews: 0,
            totalMaterialCost: 0,
            profitMargin: 0
        });
        
        await product.save();
        
        console.log('✅ Seller product created:', product._id);
        
        res.status(201).json({
            success: true,
            message: 'Product created, waiting for admin approval',
            product: product
        });
        
    } catch (error) {
        console.error('❌ Seller create product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// UPDATE product (Seller)
router.put('/seller/:id', protect, uploadProductImagesWithNew, handleUploadError, async (req, res) => {
    try {
        console.log('📝 Seller updating product:', req.params.id);
        
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        // Check ownership
        if (product.sellerId && product.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        
        const { name, description, price, category, stock, isActive, existingImages } = req.body;
        
        let existingImagesArray = [];
        if (existingImages) {
            try {
                existingImagesArray = typeof existingImages === 'string' 
                    ? JSON.parse(existingImages) 
                    : existingImages;
            } catch (e) {
                existingImagesArray = product.images || [];
            }
        } else {
            existingImagesArray = product.images || [];
        }
        
        let newImageUrls = [];
        if (req.files && req.files.length > 0) {
            newImageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
        }
        
        const allImages = [...existingImagesArray, ...newImageUrls];
        
        product.name = name || product.name;
        product.description = description !== undefined ? description : product.description;
        product.price = price ? Number(price) : product.price;
        product.category = category || product.category;
        product.images = allImages;
        product.stock = stock !== undefined ? Number(stock) : product.stock;
        product.isActive = isActive === 'true' || isActive === true;
        product.updatedAt = new Date();
        
        await product.save();
        
        console.log('✅ Seller product updated:', product._id);
        
        res.json({
            success: true,
            message: 'Product updated successfully',
            product: product
        });
        
    } catch (error) {
        console.error('❌ Seller update product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE product (Seller)
router.delete('/seller/:id', protect, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        // Check ownership
        if (product.sellerId && product.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        
        // Delete associated recipe
        await ProductRecipe.findOneAndDelete({ productId: req.params.id });
        
        // Delete product images
        for (const imagePath of product.images) {
            const fullPath = path.join(uploadDir, 'products', path.basename(imagePath));
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }
        
        await product.deleteOne();
        
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
        
    } catch (error) {
        console.error('Seller delete product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== RECIPE ROUTES ====================

// Get product recipe
router.get('/:id/recipe', protect, async (req, res) => {
    try {
        const recipe = await ProductRecipe.findOne({ productId: req.params.id })
            .populate('rawMaterials.materialId', 'name category unit costPerUnit');
        
        res.json({ success: true, recipe });
    } catch (error) {
        console.error('Get recipe error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Save product recipe
router.post('/:id/recipe', protect, async (req, res) => {
    try {
        const { rawMaterials, productionTimeMinutes } = req.body;
        
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        let recipe = await ProductRecipe.findOne({ productId: req.params.id });
        
        // Calculate total material cost
        let totalCost = 0;
        for (const item of rawMaterials) {
            const material = await RawMaterial.findById(item.materialId);
            if (material) {
                const cost = material.costPerUnit * item.quantity;
                const withWastage = cost * (1 + (item.wastageFactor || 0) / 100);
                totalCost += withWastage;
            }
        }
        
        const roundedTotalCost = Math.round(totalCost * 100) / 100;
        
        if (recipe) {
            recipe.rawMaterials = rawMaterials;
            recipe.productionTimeMinutes = productionTimeMinutes || 30;
            recipe.totalMaterialCost = roundedTotalCost;
            await recipe.save();
        } else {
            recipe = await ProductRecipe.create({
                productId: req.params.id,
                productName: product.name,
                sellerId: product.sellerId || req.user._id,
                rawMaterials,
                productionTimeMinutes: productionTimeMinutes || 30,
                totalMaterialCost: roundedTotalCost,
                isActive: true
            });
        }
        
        // Update product
        product.hasRecipe = true;
        product.recipeId = recipe._id;
        product.totalMaterialCost = roundedTotalCost;
        product.inventoryTrackingEnabled = true;
        product.updatedAt = new Date();
        
        // Calculate profit margin
        if (product.price > 0 && roundedTotalCost > 0) {
            const profit = product.price - roundedTotalCost;
            product.profitMargin = Math.round((profit / product.price) * 100);
        }
        
        await product.save();
        
        res.json({ success: true, message: 'Recipe saved successfully', recipe });
        
    } catch (error) {
        console.error('Save recipe error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete product recipe
router.delete('/:id/recipe', protect, async (req, res) => {
    try {
        await ProductRecipe.findOneAndDelete({ productId: req.params.id });
        
        await Product.findByIdAndUpdate(req.params.id, {
            hasRecipe: false,
            recipeId: null,
            totalMaterialCost: 0,
            inventoryTrackingEnabled: false,
            profitMargin: 0,
            updatedAt: new Date()
        });
        
        res.json({ success: true, message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Delete recipe error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update product stock (Admin)
router.patch('/:id/stock', protect, admin, async (req, res) => {
    try {
        const { quantity, operation } = req.body;
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        let newQuantity;
        switch (operation) {
            case 'add':
                newQuantity = product.stock + quantity;
                break;
            case 'subtract':
                newQuantity = Math.max(0, product.stock - quantity);
                break;
            default:
                newQuantity = quantity;
        }
        
        product.stock = newQuantity;
        product.updatedAt = new Date();
        await product.save();
        
        res.json({ 
            success: true, 
            message: 'Stock updated successfully', 
            product 
        });
    } catch (error) {
        console.error('Update stock error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;