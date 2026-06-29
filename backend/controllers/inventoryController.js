// backend/controllers/inventoryController.js

const mongoose = require('mongoose');
const RawMaterial = require('../models/RawMaterial');
const InventoryTransaction = require('../models/InventoryTransaction');
const ProductBOM = require('../models/ProductBOM');
const Product = require('../models/Product');

// ==================== SELLER RAW MATERIAL CRUD ====================

exports.getSellerMaterials = async (req, res) => {
    try {
        const materials = await RawMaterial.find({ sellerId: req.user._id })
            .sort({ createdAt: -1 });
        
        const totalValue = materials.reduce((sum, m) => sum + (m.quantity * m.costPerUnit), 0);
        const lowStockCount = materials.filter(m => m.quantity <= m.minThreshold).length;
        const outOfStockCount = materials.filter(m => m.quantity <= 0).length;
        
        res.json({
            success: true,
            count: materials.length,
            materials,
            stats: {
                totalMaterials: materials.length,
                totalValue,
                lowStockCount,
                outOfStockCount
            }
        });
    } catch (error) {
        console.error('Error in getSellerMaterials:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            materials: []
        });
    }
};

exports.createSellerMaterial = async (req, res) => {
    try {
        const {
            name, category, unit, quantity, minThreshold,
            costPerUnit, supplierName, supplierLink, notes
        } = req.body;
        
        const material = new RawMaterial({
            sellerId: req.user._id,
            sellerName: req.user.shopName || req.user.name,
            name,
            category: category || 'Other',
            unit: unit || 'piece',
            quantity: quantity || 0,
            minThreshold: minThreshold || 10,
            costPerUnit: costPerUnit || 0,
            supplierName: supplierName || '',
            supplierLink: supplierLink || '',
            notes: notes || '',
            status: 'active'
        });
        
        await material.save();
        
        if (quantity > 0) {
            const transaction = new InventoryTransaction({
                materialId: material._id,
                sellerId: req.user._id,
                type: 'add',
                quantity: quantity,
                previousQuantity: 0,
                newQuantity: quantity,
                note: 'Initial stock added'
            });
            await transaction.save();
        }
        
        res.status(201).json({
            success: true,
            message: 'Material added successfully',
            material
        });
    } catch (error) {
        console.error('Error in createSellerMaterial:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateSellerMaterial = async (req, res) => {
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
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        
        res.json({
            success: true,
            message: 'Material updated successfully',
            material: updatedMaterial
        });
    } catch (error) {
        console.error('Error in updateSellerMaterial:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteSellerMaterial = async (req, res) => {
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
        console.error('Error in deleteSellerMaterial:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateSellerStock = async (req, res) => {
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
        
        const previousQuantity = material.quantity;
        let newQuantity;
        
        switch (operation) {
            case 'add':
                newQuantity = material.quantity + quantity;
                break;
            case 'deduct':
                newQuantity = Math.max(0, material.quantity - quantity);
                break;
            case 'set':
            default:
                newQuantity = Math.max(0, quantity);
                break;
        }
        
        material.quantity = newQuantity;
        await material.save();
        
        const transaction = new InventoryTransaction({
            materialId: material._id,
            sellerId: req.user._id,
            type: operation === 'deduct' ? 'adjust' : operation,
            quantity: quantity,
            previousQuantity,
            newQuantity,
            note: note || `Stock ${operation}: ${quantity} ${material.unit}`
        });
        await transaction.save();
        
        const isLowStock = newQuantity <= material.minThreshold;
        
        res.json({
            success: true,
            message: 'Stock updated successfully',
            material,
            previousQuantity,
            newQuantity,
            isLowStock,
            alert: isLowStock ? `⚠️ Low stock: ${material.name} is below ${material.minThreshold} ${material.unit}` : null
        });
    } catch (error) {
        console.error('Error in updateSellerStock:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getProductBOM = async (req, res) => {
    try {
        const bom = await ProductBOM.findOne({
            productId: req.params.productId,
            sellerId: req.user._id
        }).populate('materials.materialId', 'name category unit costPerUnit');
        
        res.json({
            success: true,
            bom: bom || null
        });
    } catch (error) {
        console.error('Error in getProductBOM:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.saveProductBOM = async (req, res) => {
    try {
        const { productId, materials, profitMargin } = req.body;
        
        const product = await Product.findOne({
            _id: productId,
            sellerId: req.user._id
        });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        const enrichedMaterials = [];
        let totalManufacturingCost = 0;
        
        for (const item of materials) {
            const material = await RawMaterial.findOne({
                _id: item.materialId,
                sellerId: req.user._id
            });
            
            if (material) {
                const totalCost = item.quantityRequired * material.costPerUnit;
                enrichedMaterials.push({
                    materialId: item.materialId,
                    materialName: material.name,
                    quantityRequired: item.quantityRequired,
                    unit: material.unit,
                    costPerUnit: material.costPerUnit,
                    totalCost
                });
                totalManufacturingCost += totalCost;
            }
        }
        
        const suggestedPrice = totalManufacturingCost * (1 + (profitMargin || 30) / 100);
        
        const bom = await ProductBOM.findOneAndUpdate(
            { productId, sellerId: req.user._id },
            {
                productId,
                sellerId: req.user._id,
                materials: enrichedMaterials,
                totalManufacturingCost,
                profitMargin: profitMargin || 30,
                suggestedPrice,
                isActive: true
            },
            { upsert: true, new: true }
        );
        
        await Product.findByIdAndUpdate(productId, {
            manufacturingCost: totalManufacturingCost,
            suggestedPrice
        });
        
        res.json({
            success: true,
            message: 'BOM saved successfully',
            bom
        });
    } catch (error) {
        console.error('Error in saveProductBOM:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.autoDeductStock = async (req, res) => {
    try {
        const { orderId, items } = req.body;
        
        const deductions = [];
        const errors = [];
        
        for (const item of items) {
            const bom = await ProductBOM.findOne({
                productId: item.productId,
                sellerId: req.user._id,
                isActive: true
            });
            
            if (bom) {
                for (const material of bom.materials) {
                    const totalRequired = material.quantityRequired * item.quantity;
                    
                    const inventoryItem = await RawMaterial.findOne({
                        _id: material.materialId,
                        sellerId: req.user._id
                    });
                    
                    if (inventoryItem) {
                        if (inventoryItem.quantity < totalRequired) {
                            errors.push({
                                materialName: inventoryItem.name,
                                available: inventoryItem.quantity,
                                required: totalRequired
                            });
                        } else {
                            const previousQuantity = inventoryItem.quantity;
                            const newQuantity = inventoryItem.quantity - totalRequired;
                            
                            inventoryItem.quantity = newQuantity;
                            await inventoryItem.save();
                            
                            const transaction = new InventoryTransaction({
                                materialId: inventoryItem._id,
                                sellerId: req.user._id,
                                productId: item.productId,
                                orderId: orderId,
                                type: 'order_deduct',
                                quantity: totalRequired,
                                previousQuantity,
                                newQuantity,
                                note: `Auto deducted for order - Product: ${item.productName || item.productId} x${item.quantity}`
                            });
                            await transaction.save();
                            
                            deductions.push({
                                materialId: inventoryItem._id,
                                materialName: inventoryItem.name,
                                deducted: totalRequired,
                                remaining: newQuantity
                            });
                        }
                    }
                }
            }
        }
        
        res.json({
            success: true,
            message: errors.length > 0 ? 'Partial deduction with errors' : 'Stock deducted successfully',
            deductions,
            errors
        });
    } catch (error) {
        console.error('Error in autoDeductStock:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getSellerTransactions = async (req, res) => {
    try {
        const { limit = 50, materialId } = req.query;
        
        let query = { sellerId: req.user._id };
        if (materialId) query.materialId = materialId;
        
        const transactions = await InventoryTransaction.find(query)
            .populate('materialId', 'name unit')
            .populate('productId', 'name')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));
        
        res.json({
            success: true,
            count: transactions.length,
            transactions
        });
    } catch (error) {
        console.error('Error in getSellerTransactions:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getSellerLowStock = async (req, res) => {
    try {
        const materials = await RawMaterial.find({
            sellerId: req.user._id,
            $expr: { $lte: ['$quantity', '$minThreshold'] }
        }).sort({ quantity: 1 });
        
        res.json({
            success: true,
            count: materials.length,
            materials
        });
    } catch (error) {
        console.error('Error in getSellerLowStock:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            materials: []
        });
    }
};

exports.getSellerInventoryStats = async (req, res) => {
    try {
        const materials = await RawMaterial.find({ sellerId: req.user._id });
        
        const totalMaterials = materials.length;
        const totalValue = materials.reduce((sum, m) => sum + (m.quantity * m.costPerUnit), 0);
        const lowStockCount = materials.filter(m => m.quantity <= m.minThreshold).length;
        const outOfStockCount = materials.filter(m => m.quantity <= 0).length;
        
        const categoryBreakdown = {};
        materials.forEach(m => {
            if (!categoryBreakdown[m.category]) {
                categoryBreakdown[m.category] = { count: 0, value: 0 };
            }
            categoryBreakdown[m.category].count++;
            categoryBreakdown[m.category].value += m.quantity * m.costPerUnit;
        });
        
        const recentTransactions = await InventoryTransaction.find({ sellerId: req.user._id })
            .populate('materialId', 'name unit')
            .sort({ createdAt: -1 })
            .limit(10);
        
        res.json({
            success: true,
            stats: {
                totalMaterials,
                totalValue,
                lowStockCount,
                outOfStockCount,
                categoryBreakdown
            },
            recentTransactions
        });
    } catch (error) {
        console.error('Error in getSellerInventoryStats:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== ✅ ADMIN INVENTORY (READ-ONLY) - FIXED ====================

// @desc    Get all materials from rawmaterials collection
// @route   GET /api/inventory/materials
exports.getMaterials = async (req, res) => {
    try {
        console.log('🔍 ADMIN getMaterials - Fetching from rawmaterials collection');
        
        // ✅ Direct query to rawmaterials collection
        const materials = await RawMaterial.find({}).lean();
        
        console.log(`📦 Found ${materials.length} materials in rawmaterials collection`);
        
        if (materials.length > 0) {
            materials.forEach((m, i) => {
                console.log(`  ${i+1}. ${m.name} - ${m.quantity} ${m.unit}`);
            });
        }
        
        // Calculate stats
        const totalValue = materials.reduce((sum, m) => sum + ((m.quantity || 0) * (m.costPerUnit || 0)), 0);
        const lowStockCount = materials.filter(m => (m.quantity || 0) <= (m.minThreshold || 0)).length;
        
        res.json({
            success: true,
            count: materials.length,
            materials,
            stats: {
                totalMaterials: materials.length,
                totalValue,
                lowStockCount,
                outOfStockCount: materials.filter(m => (m.quantity || 0) <= 0).length
            }
        });
        
    } catch (error) {
        console.error('❌ Error in getMaterials:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            materials: []
        });
    }
};

// @desc    Get single material by ID
// @route   GET /api/inventory/materials/:id
exports.getMaterialById = async (req, res) => {
    try {
        const material = await RawMaterial.findById(req.params.id).lean();
        
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }
        
        res.json({
            success: true,
            material
        });
    } catch (error) {
        console.error('Error in getMaterialById:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get low stock materials (Admin view)
// @route   GET /api/inventory/low-stock
exports.getLowStockMaterials = async (req, res) => {
    try {
        const materials = await RawMaterial.find({
            $expr: { $lte: ['$quantity', '$minThreshold'] }
        }).lean();
        
        console.log(`⚠️ Low stock materials: ${materials.length}`);
        
        res.json({
            success: true,
            count: materials.length,
            materials
        });
    } catch (error) {
        console.error('Error in getLowStockMaterials:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            materials: []
        });
    }
};

// @desc    Get inventory stats (Admin view)
// @route   GET /api/inventory/stats
exports.getInventoryStats = async (req, res) => {
    try {
        const materials = await RawMaterial.find({}).lean();
        
        const totalMaterials = materials.length;
        const totalValue = materials.reduce((sum, m) => sum + ((m.quantity || 0) * (m.costPerUnit || 0)), 0);
        const lowStockCount = materials.filter(m => (m.quantity || 0) <= (m.minThreshold || 0)).length;
        const outOfStockCount = materials.filter(m => (m.quantity || 0) <= 0).length;
        
        res.json({
            success: true,
            stats: {
                totalMaterials,
                totalValue,
                lowStockCount,
                outOfStockCount,
                categoryBreakdown: {}
            }
        });
    } catch (error) {
        console.error('Error in getInventoryStats:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};