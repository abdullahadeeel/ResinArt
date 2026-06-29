const Material = require('../models/Material');

// ==================== ADMIN & SELLER (READ ONLY) ====================

// @desc    Get all materials (filtered for sellers)
// @route   GET /api/materials
// @access  Private (Admin + Seller can view)
const getMaterials = async (req, res) => {
    try {
        const { category, search, minStock } = req.query;
        let filter = {};
        
        // Apply filters
        if (category) filter.category = category;
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }
        if (minStock) {
            filter.quantity = { $lte: minStock };
        }
        
        const materials = await Material.find(filter).sort({ name: 1 });
        
        res.status(200).json({
            success: true,
            count: materials.length,
            materials
        });
    } catch (error) {
        console.error('Get materials error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching materials',
            error: error.message
        });
    }
};

// @desc    Get single material by ID
// @route   GET /api/materials/:id
// @access  Private (Admin + Seller)
const getMaterialById = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }
        
        res.status(200).json({
            success: true,
            material
        });
    } catch (error) {
        console.error('Get material error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching material'
        });
    }
};

// ==================== ADMIN ONLY (WRITE OPERATIONS) ====================

// @desc    Create new material
// @route   POST /api/materials
// @access  Private/Admin only
const createMaterial = async (req, res) => {
    try {
        const { name, category, unit, quantity, minStockLevel, costPerUnit, supplier, sku, description } = req.body;
        
        // Check if material already exists
        const existingMaterial = await Material.findOne({ name });
        if (existingMaterial) {
            return res.status(400).json({
                success: false,
                message: 'Material with this name already exists'
            });
        }
        
        const material = await Material.create({
            name,
            category,
            unit,
            quantity: quantity || 0,
            minStockLevel: minStockLevel || 10,
            costPerUnit,
            supplier,
            sku,
            description,
            createdBy: req.user.id
        });
        
        res.status(201).json({
            success: true,
            message: 'Material created successfully',
            material
        });
    } catch (error) {
        console.error('Create material error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating material',
            error: error.message
        });
    }
};

// @desc    Update material
// @route   PUT /api/materials/:id
// @access  Private/Admin only
const updateMaterial = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }
        
        const updatedMaterial = await Material.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        res.status(200).json({
            success: true,
            message: 'Material updated successfully',
            material: updatedMaterial
        });
    } catch (error) {
        console.error('Update material error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating material'
        });
    }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private/Admin only
const deleteMaterial = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }
        
        await material.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'Material deleted successfully'
        });
    } catch (error) {
        console.error('Delete material error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting material'
        });
    }
};

// @desc    Update stock quantity (inventory adjustment)
// @route   PATCH /api/materials/:id/stock
// @access  Private/Admin only
const updateStock = async (req, res) => {
    try {
        const { quantity, operation } = req.body;
        // operation: 'set', 'add', 'subtract'
        
        const material = await Material.findById(req.params.id);
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
                newQuantity = material.quantity - quantity;
                if (newQuantity < 0) newQuantity = 0;
                break;
            default:
                newQuantity = quantity;
        }
        
        material.quantity = newQuantity;
        await material.save();
        
        // Check for low stock alert
        let alert = null;
        if (material.quantity <= material.minStockLevel) {
            alert = `⚠️ Low stock alert: ${material.name} is below minimum stock level (${material.quantity} ${material.unit} left)`;
        }
        
        res.status(200).json({
            success: true,
            message: 'Stock updated successfully',
            material,
            alert
        });
    } catch (error) {
        console.error('Update stock error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating stock'
        });
    }
};

// @desc    Get low stock materials (for alerts)
// @route   GET /api/materials/low-stock
// @access  Private/Admin only
const getLowStockMaterials = async (req, res) => {
    try {
        const materials = await Material.find({
            $expr: {
                $lte: ['$quantity', '$minStockLevel']
            }
        }).sort({ quantity: 1 });
        
        res.status(200).json({
            success: true,
            count: materials.length,
            materials
        });
    } catch (error) {
        console.error('Get low stock error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching low stock materials'
        });
    }
};

// @desc    Get material categories (for filters)
// @route   GET /api/materials/categories
// @access  Private
const getMaterialCategories = async (req, res) => {
    try {
        const categories = await Material.distinct('category');
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching categories'
        });
    }
};

module.exports = {
    getMaterials,
    getMaterialById,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    updateStock,
    getLowStockMaterials,
    getMaterialCategories
};