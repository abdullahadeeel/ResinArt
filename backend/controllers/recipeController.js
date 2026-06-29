// backend/controllers/recipeController.js
const ProductRecipe = require('../models/ProductRecipe');
const RawMaterial = require('../models/RawMaterial');
const Product = require('../models/Product');

// @desc    Get all raw materials for dropdown
// @route   GET /api/recipes/materials
// @access  Private (Admin/Seller)
const getAvailableMaterials = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'seller') {
            query.sellerId = req.user._id;
        }
        
        const materials = await RawMaterial.find(query).select('_id name category unit costPerUnit quantity');
        res.json({ success: true, materials });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Save product recipe
// @route   POST /api/recipes/product/:productId
// @access  Private (Admin/Seller)
const saveProductRecipe = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rawMaterials, productionTimeMinutes } = req.body;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        // Check authorization
        if (req.user.role === 'seller' && product.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        
        let recipe = await ProductRecipe.findOne({ productId });
        
        if (recipe) {
            recipe.rawMaterials = rawMaterials;
            recipe.productionTimeMinutes = productionTimeMinutes || 30;
            await recipe.save();
        } else {
            recipe = await ProductRecipe.create({
                productId,
                productName: product.name,
                sellerId: product.sellerId,
                rawMaterials,
                productionTimeMinutes: productionTimeMinutes || 30,
                isActive: true
            });
        }
        
        // Update product
        product.hasRecipe = true;
        product.recipeId = recipe._id;
        product.totalMaterialCost = recipe.totalMaterialCost;
        product.inventoryTrackingEnabled = true;
        await product.save();
        
        res.json({ success: true, recipe });
    } catch (error) {
        console.error('Save recipe error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get product recipe
// @route   GET /api/recipes/product/:productId
// @access  Private (Admin/Seller)
const getProductRecipe = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const recipe = await ProductRecipe.findOne({ productId })
            .populate('rawMaterials.materialId', 'name category unit costPerUnit');
        
        res.json({ success: true, recipe });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete product recipe
// @route   DELETE /api/recipes/product/:productId
// @access  Private (Admin/Seller)
const deleteProductRecipe = async (req, res) => {
    try {
        const { productId } = req.params;
        
        await ProductRecipe.findOneAndDelete({ productId });
        
        await Product.findByIdAndUpdate(productId, {
            hasRecipe: false,
            recipeId: null,
            totalMaterialCost: 0,
            inventoryTrackingEnabled: false
        });
        
        res.json({ success: true, message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAvailableMaterials,
    saveProductRecipe,
    getProductRecipe,
    deleteProductRecipe
};