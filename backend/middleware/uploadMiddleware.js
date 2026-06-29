// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Uploads directory created at:', uploadDir);
}

// ✅ Create subdirectories for different upload types
const productUploadDir = path.join(uploadDir, 'products');
const materialUploadDir = path.join(uploadDir, 'materials');

if (!fs.existsSync(productUploadDir)) {
    fs.mkdirSync(productUploadDir, { recursive: true });
}
if (!fs.existsSync(materialUploadDir)) {
    fs.mkdirSync(materialUploadDir, { recursive: true });
}

// ✅ Storage configuration with dynamic folder selection
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Determine folder based on fieldname or route
        let folder = uploadDir;
        
        if (file.fieldname === 'productImages' || req.baseUrl.includes('/products')) {
            folder = productUploadDir;
        } else if (file.fieldname === 'materialImages' || req.baseUrl.includes('/materials')) {
            folder = materialUploadDir;
        }
        
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        // Create unique filename with timestamp and original name
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-');
        const filename = `${timestamp}-${random}-${baseName}${ext}`;
        cb(null, filename);
    }
});

// ✅ File filter - only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, svg)'), false);
    }
};

// ✅ Multer configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit per file
        files: 10 // Max 10 files per request
    }
});

// ✅ Helper middleware for handling upload errors
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'FILE_TOO_LARGE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 5MB.'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum 10 files allowed.'
            });
        }
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`
        });
    }
    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

// ✅ Different upload configurations for different use cases

// For single image upload (profile picture, etc.)
const uploadSingle = (fieldName) => upload.single(fieldName);

// For multiple images with same field name (product images)
const uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);

// For multiple images with different field names (product + thumbnail)
const uploadFields = (fields) => upload.fields(fields);

// For product images (main products)
const uploadProductImages = upload.array('images', 5);
const uploadProductImagesWithNew = upload.array('newImages', 5);

// For seller product images
const uploadSellerProductImages = upload.array('images', 5);
const uploadSellerProductImagesUpdate = upload.array('newImages', 5);

// For material images (inventory)
const uploadMaterialImages = upload.single('image');

// Generic upload for any single image
const uploadAnyImage = upload.single('image');

// For multiple images with custom field name
const uploadCustomImages = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);

module.exports = {
    upload,                          // Default multer instance
    uploadSingle,                    // Single file upload
    uploadMultiple,                  // Multiple files same field
    uploadFields,                    // Multiple files different fields
    uploadProductImages,             // Product images (field: 'images')
    uploadProductImagesWithNew,      // Product images update (field: 'newImages')
    uploadSellerProductImages,       // Seller product images (field: 'images')
    uploadSellerProductImagesUpdate, // Seller product update images (field: 'newImages')
    uploadMaterialImages,            // Material images (field: 'image')
    uploadAnyImage,                  // Generic single image
    uploadCustomImages,              // Custom field name
    handleUploadError                // Error handling middleware
};