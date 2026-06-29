// backend/controllers/productController.js
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed'));
    }
});

// Middleware for multiple image upload
const uploadImages = upload.array('images', 10);

// ==================== CREATE PRODUCT ====================
const createProduct = async (req, res) => {
    try {
        console.log('📝 Creating product...');
        
        // Handle image upload first
        uploadImages(req, res, async (err) => {
            if (err) {
                console.error('Upload error:', err);
                return res.status(400).json({ success: false, message: err.message });
            }
            
            try {
                const { name, description, price, category, stock, isActive } = req.body;
                
                // Validation
                if (!name || !price || !category) {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Name, price and category are required' 
                    });
                }
                
                // Get image paths
                const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
                
                // Create product
                const product = new Product({
                    name,
                    description: description || '',
                    price: parseFloat(price),
                    category,
                    images: imagePaths,
                    stock: parseInt(stock) || 0,
                    isActive: isActive === 'true' || isActive === true,
                    isApproved: true,
                    sellerId: req.user._id,
                    seller: req.user._id, 
                    sellerName: req.user.name || 'Admin',
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                
                await product.save();
                
                console.log('✅ Product created:', product._id);
                
                res.status(201).json({
                    success: true,
                    message: 'Product created successfully',
                    data: product
                });
                
            } catch (error) {
                console.error('Create product error:', error);
                res.status(500).json({ 
                    success: false, 
                    message: error.message 
                });
            }
        });
        
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== GET ALL PRODUCTS ====================
const getProducts = async (req, res) => {
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
};

// ==================== GET PRODUCT BY ID ====================
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        res.json({
            success: true,
            data: product
        });
        
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== UPDATE PRODUCT ====================
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        // Handle image upload for update
        uploadImages(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
            
            try {
                const { name, description, price, category, stock, isActive, existingImages } = req.body;
                
                // Get existing images from request
                let existingImagesArray = [];
                if (existingImages) {
                    existingImagesArray = JSON.parse(existingImages);
                }
                
                // Get new image paths
                const newImagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
                
                // Combine existing and new images
                const allImages = [...existingImagesArray, ...newImagePaths];
                
                // Update product
                product.name = name || product.name;
                product.description = description || product.description;
                product.price = parseFloat(price) || product.price;
                product.category = category || product.category;
                product.images = allImages;
                product.stock = parseInt(stock) || product.stock;
                product.isActive = isActive === 'true' || isActive === true;
                product.updatedAt = new Date();
                
                await product.save();
                
                res.json({
                    success: true,
                    message: 'Product updated successfully',
                    data: product
                });
                
            } catch (error) {
                console.error('Update error:', error);
                res.status(500).json({ success: false, message: error.message });
            }
        });
        
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== DELETE PRODUCT ====================
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        // Delete product images from server
        for (const imagePath of product.images) {
            const fullPath = path.join(__dirname, '..', imagePath);
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
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== ADMIN: GET ALL PRODUCTS (Including pending) ====================
const getAdminProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: products.length,
            data: products
        });
        
    } catch (error) {
        console.error('Get admin products error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== ADMIN: APPROVE PRODUCT ====================
const approveProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        product.isApproved = true;
        product.updatedAt = new Date();
        await product.save();
        
        res.json({
            success: true,
            message: 'Product approved successfully',
            data: product
        });
        
    } catch (error) {
        console.error('Approve product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== ADMIN: REJECT PRODUCT ====================
const rejectProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        product.isApproved = false;
        product.updatedAt = new Date();
        await product.save();
        
        res.json({
            success: true,
            message: 'Product rejected',
            data: product
        });
        
    } catch (error) {
        console.error('Reject product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== SELLER: GET SELLER PRODUCTS ====================
const getSellerProducts = async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: products.length,
            data: products
        });
        
    } catch (error) {
        console.error('Get seller products error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== SELLER: CREATE PRODUCT ====================
const createSellerProduct = async (req, res) => {
    try {
        uploadImages(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
            
            try {
                const { name, description, price, category, stock, isActive } = req.body;
                
                if (!name || !price || !category) {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Name, price and category are required' 
                    });
                }
                
                const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
                
                const product = new Product({
                    name,
                    description: description || '',
                    price: parseFloat(price),
                    category,
                    images: imagePaths,
                    stock: parseInt(stock) || 0,
                    isActive: isActive === 'true' || isActive === true,
                    isApproved: false, // Needs admin approval
                    sellerId: req.user._id,
                    seller: req.user._id, 
                    sellerName: req.user.name || req.user.shopName || 'Seller',
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                
                await product.save();
                
                res.status(201).json({
                    success: true,
                    message: 'Product created successfully, waiting for admin approval',
                    product: product
                });
                
            } catch (error) {
                console.error('Create seller product error:', error);
                res.status(500).json({ success: false, message: error.message });
            }
        });
        
    } catch (error) {
        console.error('Create seller product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== SELLER: UPDATE PRODUCT ====================
const updateSellerProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        // Check if seller owns this product
        if (product.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        
        uploadImages(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
            
            try {
                const { name, description, price, category, stock, isActive, existingImages } = req.body;
                
                let existingImagesArray = [];
                if (existingImages) {
                    existingImagesArray = JSON.parse(existingImages);
                }
                
                const newImagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
                const allImages = [...existingImagesArray, ...newImagePaths];
                
                product.name = name || product.name;
                product.description = description || product.description;
                product.price = parseFloat(price) || product.price;
                product.category = category || product.category;
                product.images = allImages;
                product.stock = parseInt(stock) || product.stock;
                product.isActive = isActive === 'true' || isActive === true;
                product.updatedAt = new Date();
                
                await product.save();
                
                res.json({
                    success: true,
                    message: 'Product updated successfully',
                    product: product
                });
                
            } catch (error) {
                console.error('Update error:', error);
                res.status(500).json({ success: false, message: error.message });
            }
        });
        
    } catch (error) {
        console.error('Update seller product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== SELLER: DELETE PRODUCT ====================
const deleteSellerProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        if (product.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        
        // ✅ DELETE product from seller's productIds array
        const Seller = require('../models/Seller');
        await Seller.findByIdAndUpdate(
            req.user._id,
            { $pull: { productIds: product._id } }
        );
        
        for (const imagePath of product.images) {
            const fullPath = path.join(__dirname, '..', imagePath);
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
        console.error('Delete seller product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getAdminProducts,
    approveProduct,
    rejectProduct,
    getSellerProducts,
    createSellerProduct,
    updateSellerProduct,
    deleteSellerProduct
};