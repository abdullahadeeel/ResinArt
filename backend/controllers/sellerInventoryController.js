// backend/controllers/sellerInventoryController.js

const RawMaterial = require('../models/RawMaterial');
const ProductBOM = require('../models/ProductBOM');
const InventoryTransaction = require('../models/InventoryTransaction');
const Product = require('../models/Product');

// ==================== RAW MATERIAL CRUD ====================

// Get all materials for seller
exports.getMaterials = async (req, res) => {
    try {
        const materials = await RawMaterial.find({ sellerId: req.user._id })
            .sort({ createdAt: -1 });
        
        const totalValue = materials.reduce((sum, m) => sum + (m.quantity * m.costPerUnit), 0);
        const lowStockCount = materials.filter(m => m.quantity <= m.minThreshold).length;
        const outOfStockCount = materials.filter(m => m.quantity <= 0).length;
        
        res.json({
            success: true,
            materials,
            stats: {
                totalMaterials: materials.length,
                totalValue,
                lowStockCount,
                outOfStockCount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, materials: [] });
    }
};

// Create new material
exports.createMaterial = async (req, res) => {
    try {
        const { name, category, unit, quantity, minThreshold, costPerUnit, supplierName, supplierLink, notes } = req.body;
        
        if (!name || !costPerUnit) {
            return res.status(400).json({ success: false, message: 'Name and cost per unit are required' });
        }
        
        const material = new RawMaterial({
            sellerId: req.user._id,
            sellerName: req.user.shopName || req.user.name,
            name, category: category || 'Other', unit: unit || 'piece',
            quantity: quantity || 0, minThreshold: minThreshold || 10,
            costPerUnit, supplierName: supplierName || '', supplierLink: supplierLink || '', notes: notes || ''
        });
        
        await material.save();
        
        // Create transaction
        if (quantity > 0) {
            const transaction = new InventoryTransaction({
                materialId: material._id, materialName: material.name,
                sellerId: req.user._id, type: 'add', quantity: quantity,
                previousQuantity: 0, newQuantity: quantity, note: 'Initial stock added'
            });
            await transaction.save();
        }
        
        res.status(201).json({ success: true, message: 'Material added successfully', material });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update material
exports.updateMaterial = async (req, res) => {
    try {
        const material = await RawMaterial.findOne({ _id: req.params.id, sellerId: req.user._id });
        if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
        
        const updatedMaterial = await RawMaterial.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, message: 'Material updated successfully', material: updatedMaterial });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete material
exports.deleteMaterial = async (req, res) => {
    try {
        const material = await RawMaterial.findOneAndDelete({ _id: req.params.id, sellerId: req.user._id });
        if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
        
        res.json({ success: true, message: 'Material deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== STOCK MANAGEMENT ====================

// Update stock (add/deduct/set)
exports.updateStock = async (req, res) => {
    try {
        const { quantity, operation, note } = req.body;
        const material = await RawMaterial.findOne({ _id: req.params.id, sellerId: req.user._id });
        
        if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
        
        const previousQuantity = material.quantity;
        let newQuantity;
        
        switch (operation) {
            case 'add': newQuantity = material.quantity + quantity; break;
            case 'deduct': newQuantity = Math.max(0, material.quantity - quantity); break;
            default: newQuantity = Math.max(0, quantity);
        }
        
        material.quantity = newQuantity;
        await material.save();
        
        // Create transaction
        const transaction = new InventoryTransaction({
            materialId: material._id, materialName: material.name, sellerId: req.user._id,
            type: operation === 'deduct' ? 'deduct' : 'restock', quantity: quantity,
            previousQuantity, newQuantity, note: note || `Stock ${operation}: ${quantity} ${material.unit}`
        });
        await transaction.save();
        
        res.json({ success: true, message: 'Stock updated', material, isLowStock: newQuantity <= material.minThreshold });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== LOW STOCK ALERTS ====================

exports.getLowStockMaterials = async (req, res) => {
    try {
        const materials = await RawMaterial.find({
            sellerId: req.user._id,
            $expr: { $lte: ['$quantity', '$minThreshold'] }
        });
        res.json({ success: true, count: materials.length, materials });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, materials: [] });
    }
};

// ==================== PRODUCT BOM (Raw Material Linking) ====================

// Get all products for BOM dropdown
exports.getSellerProducts = async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.user._id }).select('_id name price');
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get BOM for a product
exports.getProductBOM = async (req, res) => {
    try {
        const bom = await ProductBOM.findOne({ productId: req.params.productId, sellerId: req.user._id })
            .populate('materials.materialId', 'name unit costPerUnit');
        res.json({ success: true, bom });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Save/Update BOM
exports.saveProductBOM = async (req, res) => {
    try {
        const { productId, productName, materials, profitMargin } = req.body;
        
        // Verify product belongs to seller
        const product = await Product.findOne({ _id: productId, sellerId: req.user._id });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        
        // Enrich materials with costs
        const enrichedMaterials = [];
        for (const item of materials) {
            const material = await RawMaterial.findOne({ _id: item.materialId, sellerId: req.user._id });
            if (material) {
                enrichedMaterials.push({
                    materialId: item.materialId,
                    materialName: material.name,
                    quantityRequired: item.quantityRequired,
                    unit: material.unit,
                    costPerUnit: material.costPerUnit,
                    totalCost: item.quantityRequired * material.costPerUnit
                });
            }
        }
        
        const bom = await ProductBOM.findOneAndUpdate(
            { productId, sellerId: req.user._id },
            { productId, productName: productName || product.name, sellerId: req.user._id,
              materials: enrichedMaterials, profitMargin: profitMargin || 30, isActive: true },
            { upsert: true, new: true }
        );
        
        res.json({ success: true, message: 'BOM saved successfully', bom });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete BOM
exports.deleteProductBOM = async (req, res) => {
    try {
        await ProductBOM.findOneAndDelete({ productId: req.params.productId, sellerId: req.user._id });
        res.json({ success: true, message: 'BOM deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== AUTO STOCK DEDUCTION (on Order) ====================

exports.autoDeductStock = async (req, res) => {
    try {
        const { orderId, items } = req.body;
        const deductions = [];
        const errors = [];
        
        for (const item of items) {
            const bom = await ProductBOM.findOne({ productId: item.productId, sellerId: req.user._id, isActive: true });
            
            if (bom) {
                for (const material of bom.materials) {
                    const totalRequired = material.quantityRequired * item.quantity;
                    const inventoryItem = await RawMaterial.findOne({ _id: material.materialId, sellerId: req.user._id });
                    
                    if (inventoryItem) {
                        if (inventoryItem.quantity < totalRequired) {
                            errors.push({ materialName: inventoryItem.name, available: inventoryItem.quantity, required: totalRequired });
                        } else {
                            const previousQuantity = inventoryItem.quantity;
                            inventoryItem.quantity -= totalRequired;
                            await inventoryItem.save();
                            
                            const transaction = new InventoryTransaction({
                                materialId: inventoryItem._id, materialName: inventoryItem.name,
                                sellerId: req.user._id, productId: item.productId,
                                productName: item.productName, orderId, type: 'order_deduct',
                                quantity: totalRequired, previousQuantity, newQuantity: inventoryItem.quantity,
                                note: `Auto deducted for order - Product: ${item.productName} x${item.quantity}`
                            });
                            await transaction.save();
                            
                            deductions.push({ materialName: inventoryItem.name, deducted: totalRequired, remaining: inventoryItem.quantity });
                        }
                    }
                }
            }
        }
        
        res.json({ success: true, deductions, errors, hasError: errors.length > 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== TRANSACTIONS HISTORY ====================

exports.getTransactions = async (req, res) => {
    try {
        const { limit = 50, materialId } = req.query;
        let query = { sellerId: req.user._id };
        if (materialId) query.materialId = materialId;
        
        const transactions = await InventoryTransaction.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));
        
        res.json({ success: true, count: transactions.length, transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== DASHBOARD STATS & ANALYTICS ====================

exports.getDashboardStats = async (req, res) => {
    try {
        const materials = await RawMaterial.find({ sellerId: req.user._id });
        
        const totalMaterials = materials.length;
        const totalValue = materials.reduce((sum, m) => sum + (m.quantity * m.costPerUnit), 0);
        const lowStockCount = materials.filter(m => m.quantity <= m.minThreshold).length;
        const outOfStockCount = materials.filter(m => m.quantity <= 0).length;
        
        // Category breakdown
        const categoryBreakdown = {};
        materials.forEach(m => {
            if (!categoryBreakdown[m.category]) categoryBreakdown[m.category] = { count: 0, value: 0 };
            categoryBreakdown[m.category].count++;
            categoryBreakdown[m.category].value += m.quantity * m.costPerUnit;
        });
        
        // Recent transactions
        const recentTransactions = await InventoryTransaction.find({ sellerId: req.user._id })
            .sort({ createdAt: -1 }).limit(10);
        
        // Low stock items
        const lowStockItems = materials.filter(m => m.quantity <= m.minThreshold).map(m => ({
            name: m.name, quantity: m.quantity, minThreshold: m.minThreshold, unit: m.unit
        }));
        
        res.json({
            success: true,
            stats: { totalMaterials, totalValue, lowStockCount, outOfStockCount, categoryBreakdown },
            recentTransactions,
            lowStockItems
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== EXPORT REPORT ====================

exports.exportReport = async (req, res) => {
    try {
        const materials = await RawMaterial.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
        
        const report = materials.map(m => ({
            name: m.name, category: m.category, quantity: m.quantity, unit: m.unit,
            minThreshold: m.minThreshold, costPerUnit: m.costPerUnit,
            totalValue: m.quantity * m.costPerUnit, supplier: m.supplierName,
            status: m.quantity <= m.minThreshold ? 'Low Stock' : (m.quantity <= 0 ? 'Out of Stock' : 'In Stock')
        }));
        
        res.json({ success: true, report, generatedAt: new Date() });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};