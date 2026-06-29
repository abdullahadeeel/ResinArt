// backend/routes/sellerInventoryRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { seller } = require('../middleware/sellerMiddleware');
const RawMaterial = require('../models/RawMaterial');

// ==================== GET ALL MATERIALS ====================
router.get('/materials', protect, seller, async (req, res) => {
    try {
        const materials = await RawMaterial.find({ sellerId: req.user._id })
            .sort({ createdAt: -1 });
        
        // Calculate stats
        const totalValue = materials.reduce((sum, m) => sum + (m.quantity * m.costPerUnit), 0);
        const lowStockCount = materials.filter(m => m.quantity <= m.minThreshold).length;
        const outOfStockCount = materials.filter(m => m.quantity <= 0).length;
        
        res.json({
            success: true,
            materials: materials,
            stats: {
                totalMaterials: materials.length,
                totalValue: totalValue,
                lowStockCount: lowStockCount,
                outOfStockCount: outOfStockCount
            }
        });
    } catch (error) {
        console.error('Error in GET /materials:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            materials: []
        });
    }
});

// ==================== GET SINGLE MATERIAL ====================
router.get('/materials/:id', protect, seller, async (req, res) => {
    try {
        const material = await RawMaterial.findOne({
            _id: req.params.id,
            sellerId: req.user._id
        });
        
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }
        
        res.json({
            success: true,
            material: material
        });
    } catch (error) {
        console.error('Error in GET /materials/:id:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==================== CREATE MATERIAL ====================
router.post('/materials', protect, seller, async (req, res) => {
    try {
        const {
            name,
            category,
            unit,
            quantity,
            minThreshold,
            costPerUnit,
            supplierName,
            supplierLink,
            notes
        } = req.body;
        
        // Validation
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Material name is required'
            });
        }
        
        if (!costPerUnit || costPerUnit <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid cost per unit is required'
            });
        }
        
        const material = new RawMaterial({
            sellerId: req.user._id,
            sellerName: req.user.shopName || req.user.name,
            name: name,
            category: category || 'Other',
            unit: unit || 'piece',
            quantity: quantity || 0,
            minThreshold: minThreshold || 10,
            costPerUnit: costPerUnit,
            supplierName: supplierName || '',
            supplierLink: supplierLink || '',
            notes: notes || '',
            status: 'active'
        });
        
        await material.save();
        
        res.status(201).json({
            success: true,
            message: 'Material added successfully',
            material: material
        });
    } catch (error) {
        console.error('Error in POST /materials:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==================== UPDATE MATERIAL ====================
router.put('/materials/:id', protect, seller, async (req, res) => {
    try {
        const material = await RawMaterial.findOne({
            _id: req.params.id,
            sellerId: req.user._id
        });
        
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }
        
        const updatedMaterial = await RawMaterial.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name || material.name,
                category: req.body.category || material.category,
                unit: req.body.unit || material.unit,
                quantity: req.body.quantity !== undefined ? req.body.quantity : material.quantity,
                minThreshold: req.body.minThreshold !== undefined ? req.body.minThreshold : material.minThreshold,
                costPerUnit: req.body.costPerUnit !== undefined ? req.body.costPerUnit : material.costPerUnit,
                supplierName: req.body.supplierName || material.supplierName,
                supplierLink: req.body.supplierLink || material.supplierLink,
                notes: req.body.notes || material.notes,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );
        
        res.json({
            success: true,
            message: 'Material updated successfully',
            material: updatedMaterial
        });
    } catch (error) {
        console.error('Error in PUT /materials/:id:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==================== DELETE MATERIAL ====================
router.delete('/materials/:id', protect, seller, async (req, res) => {
    try {
        const material = await RawMaterial.findOneAndDelete({
            _id: req.params.id,
            sellerId: req.user._id
        });
        
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Material deleted successfully'
        });
    } catch (error) {
        console.error('Error in DELETE /materials/:id:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==================== UPDATE STOCK ====================
router.put('/stock/:id', protect, seller, async (req, res) => {
    try {
        const { quantity, operation, note } = req.body;
        
        const material = await RawMaterial.findOne({
            _id: req.params.id,
            sellerId: req.user._id
        });
        
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }
        
        let newQuantity;
        switch (operation) {
            case 'add':
                newQuantity = material.quantity + quantity;
                break;
            case 'subtract':
                newQuantity = Math.max(0, material.quantity - quantity);
                break;
            case 'set':
            default:
                newQuantity = Math.max(0, quantity);
                break;
        }
        
        material.quantity = newQuantity;
        await material.save();
        
        const isLowStock = newQuantity <= material.minThreshold;
        
        res.json({
            success: true,
            message: 'Stock updated successfully',
            material: material,
            isLowStock: isLowStock,
            alert: isLowStock ? `⚠️ Low stock: ${material.name} is below ${material.minThreshold} ${material.unit}` : null
        });
    } catch (error) {
        console.error('Error in PUT /stock/:id:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==================== GET LOW STOCK MATERIALS ====================
router.get('/low-stock', protect, seller, async (req, res) => {
    try {
        const materials = await RawMaterial.find({
            sellerId: req.user._id,
            $expr: { $lte: ['$quantity', '$minThreshold'] }
        }).sort({ quantity: 1 });
        
        res.json({
            success: true,
            count: materials.length,
            materials: materials
        });
    } catch (error) {
        console.error('Error in GET /low-stock:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            materials: []
        });
    }
});

// ==================== GET DASHBOARD STATS ====================
router.get('/dashboard-stats', protect, seller, async (req, res) => {
    try {
        const materials = await RawMaterial.find({ sellerId: req.user._id });
        
        const totalMaterials = materials.length;
        const totalValue = materials.reduce((sum, m) => sum + (m.quantity * m.costPerUnit), 0);
        const lowStockCount = materials.filter(m => m.quantity <= m.minThreshold).length;
        const outOfStockCount = materials.filter(m => m.quantity <= 0).length;
        
        // Category breakdown
        const categoryBreakdown = {};
        materials.forEach(m => {
            if (!categoryBreakdown[m.category]) {
                categoryBreakdown[m.category] = { count: 0, value: 0 };
            }
            categoryBreakdown[m.category].count++;
            categoryBreakdown[m.category].value += m.quantity * m.costPerUnit;
        });
        
        res.json({
            success: true,
            stats: {
                totalMaterials,
                totalValue,
                lowStockCount,
                outOfStockCount,
                categoryBreakdown
            }
        });
    } catch (error) {
        console.error('Error in GET /dashboard-stats:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;