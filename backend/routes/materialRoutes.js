// backend/routes/materialRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadMaterialImages, handleUploadError } = require('../middleware/uploadMiddleware');
const mongoose = require('mongoose');

// Define RawMaterial schema (matching your admin inventory)
const rawMaterialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, default: 'Other' },
    unit: { type: String, default: 'piece' },
    quantity: { type: Number, default: 0 },
    minStockLevel: { type: Number, default: 10 },
    costPerUnit: { type: Number, default: 0 },
    supplier: { type: String, default: '' },
    sku: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' }
}, { 
    timestamps: true,
    collection: 'rawmaterials'
});

let RawMaterial;
try {
    RawMaterial = mongoose.model('RawMaterial');
} catch {
    RawMaterial = mongoose.model('RawMaterial', rawMaterialSchema, 'rawmaterials');
}

// ==================== TEST ROUTE (MUST BE BEFORE /:id) ====================
router.get('/test', protect, (req, res) => {
    res.json({ 
        success: true, 
        message: 'Material routes are working!',
        user: { id: req.user._id, role: req.user.role }
    });
});

// ==================== LOW STOCK MATERIALS (MUST BE BEFORE /:id) ====================
router.get('/low-stock', protect, admin, async (req, res) => {
    try {
        console.log('📦 Fetching low stock materials...');
        
        const materials = await RawMaterial.find({
            $expr: { $lte: ['$quantity', '$minStockLevel'] }
        }).sort({ quantity: 1 });
        
        console.log(`✅ Found ${materials.length} low stock materials`);
        
        res.json({ 
            success: true, 
            count: materials.length, 
            materials 
        });
    } catch (error) {
        console.error('❌ Error fetching low stock materials:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// ==================== GET MATERIALS BY CATEGORY (MUST BE BEFORE /:id) ====================
router.get('/category/:category', protect, async (req, res) => {
    try {
        const { category } = req.params;
        const materials = await RawMaterial.find({ category }).sort({ name: 1 });
        
        res.json({ 
            success: true, 
            count: materials.length, 
            materials 
        });
    } catch (error) {
        console.error('❌ Error fetching materials by category:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// ==================== GET ALL MATERIALS (Seller + Admin) ====================
router.get('/', protect, async (req, res) => {
    try {
        console.log('📦 Fetching all materials from rawmaterials...');
        console.log('User role:', req.user?.role);
        
        const materials = await RawMaterial.find().sort({ name: 1 });
        
        console.log(`✅ Found ${materials.length} materials`);
        
        res.json({ 
            success: true, 
            count: materials.length, 
            materials 
        });
    } catch (error) {
        console.error('❌ Error fetching materials:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// ==================== GET SINGLE MATERIAL (MUST BE LAST) ====================
router.get('/:id', protect, async (req, res) => {
    try {
        // Check if id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid material ID format' 
            });
        }
        
        const material = await RawMaterial.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ success: false, message: 'Material not found' });
        }
        res.json({ success: true, material });
    } catch (error) {
        console.error('❌ Error fetching material:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== CREATE MATERIAL (Admin only) ====================
router.post('/', protect, admin, uploadMaterialImages, handleUploadError, async (req, res) => {
    try {
        console.log('📦 Creating material:', req.body);
        
        const materialData = { ...req.body };
        
        if (req.file) {
            materialData.image = `/uploads/materials/${req.file.filename}`;
            console.log('📸 Material image uploaded:', materialData.image);
        }
        
        const material = await RawMaterial.create(materialData);
        
        res.status(201).json({ 
            success: true, 
            message: 'Material created successfully', 
            material 
        });
    } catch (error) {
        console.error('❌ Error creating material:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// ==================== UPDATE MATERIAL (Admin only) ====================
router.put('/:id', protect, admin, uploadMaterialImages, handleUploadError, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid material ID format' 
            });
        }
        
        const materialData = { ...req.body };
        
        if (req.file) {
            materialData.image = `/uploads/materials/${req.file.filename}`;
            console.log('📸 Material image updated:', materialData.image);
        }
        
        const material = await RawMaterial.findByIdAndUpdate(
            req.params.id, 
            materialData, 
            { new: true, runValidators: true }
        );
        
        if (!material) {
            return res.status(404).json({ success: false, message: 'Material not found' });
        }
        
        res.json({ 
            success: true, 
            message: 'Material updated successfully', 
            material 
        });
    } catch (error) {
        console.error('❌ Error updating material:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// ==================== DELETE MATERIAL (Admin only) ====================
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid material ID format' 
            });
        }
        
        const material = await RawMaterial.findByIdAndDelete(req.params.id);
        
        if (!material) {
            return res.status(404).json({ success: false, message: 'Material not found' });
        }
        
        res.json({ 
            success: true, 
            message: 'Material deleted successfully' 
        });
    } catch (error) {
        console.error('❌ Error deleting material:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// ==================== UPDATE STOCK (Admin only) ====================
router.patch('/:id/stock', protect, admin, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid material ID format' 
            });
        }
        
        const { quantity, operation } = req.body;
        const material = await RawMaterial.findById(req.params.id);
        
        if (!material) {
            return res.status(404).json({ success: false, message: 'Material not found' });
        }
        
        let newQuantity;
        switch (operation) {
            case 'add':
                newQuantity = material.quantity + quantity;
                break;
            case 'subtract':
                newQuantity = Math.max(0, material.quantity - quantity);
                break;
            default:
                newQuantity = quantity;
        }
        
        material.quantity = newQuantity;
        await material.save();
        
        let alert = null;
        if (material.quantity <= material.minStockLevel) {
            alert = `⚠️ Low stock alert: ${material.name} is below minimum stock level (${material.quantity} ${material.unit} left)`;
        }
        
        res.json({ 
            success: true, 
            message: 'Stock updated successfully', 
            material,
            alert
        });
    } catch (error) {
        console.error('❌ Error updating stock:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

module.exports = router;