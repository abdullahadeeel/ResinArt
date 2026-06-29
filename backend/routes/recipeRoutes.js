// backend/routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ProductRecipe = require('../models/ProductRecipe');
const RawMaterial = require('../models/RawMaterial');
const Product = require('../models/Product');

// ==================== GET AVAILABLE MATERIALS ====================
router.get('/materials', protect, async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'seller') {
            query.sellerId = req.user._id;
        }
        
        const materials = await RawMaterial.find(query).select('_id name category unit costPerUnit quantity');
        
        res.json({ 
            success: true, 
            materials: materials 
        });
    } catch (error) {
        console.error('Get materials error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== SAVE PRODUCT RECIPE ====================
router.post('/product/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;
        const { rawMaterials, productionTimeMinutes } = req.body;
        
        console.log('📝 Saving recipe for product:', productId);
        
        // Validate rawMaterials
        if (!rawMaterials || !Array.isArray(rawMaterials) || rawMaterials.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Raw materials array is required' 
            });
        }
        
        // Find product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        // Check authorization
        if (req.user.role === 'seller' && product.sellerId && product.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        
        // Process each raw material - fetch material details from database
        const processedMaterials = [];
        let totalCost = 0;
        
        for (const item of rawMaterials) {
            // Skip if materialId is missing or quantity is invalid
            if (!item.materialId || !item.quantity || item.quantity <= 0) {
                continue;
            }
            
            // Fetch material from database to get name and unit
            const material = await RawMaterial.findById(item.materialId);
            if (!material) {
                console.log(`⚠️ Material not found: ${item.materialId}`);
                continue;
            }
            
            const quantity = Number(item.quantity);
            const wastageFactor = Number(item.wastageFactor) || 0;
            
            // Calculate cost
            const cost = material.costPerUnit * quantity;
            const withWastage = cost * (1 + wastageFactor / 100);
            totalCost += withWastage;
            
            // Add to processed materials with all required fields
            processedMaterials.push({
                materialId: material._id,
                materialName: material.name,
                quantity: quantity,
                unit: material.unit,
                wastageFactor: wastageFactor
            });
        }
        
        if (processedMaterials.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'At least one valid raw material is required' 
            });
        }
        
        const roundedTotalCost = Math.round(totalCost * 100) / 100;
        
        // ✅ DECLARE recipe variable FIRST
        let recipe = await ProductRecipe.findOne({ productId });
        
        if (recipe) {
            // Update existing recipe
            recipe.rawMaterials = processedMaterials;
            recipe.productionTimeMinutes = productionTimeMinutes || 30;
            recipe.totalMaterialCost = roundedTotalCost;
            await recipe.save();
            console.log('✅ Recipe updated with', processedMaterials.length, 'materials');
        } else {
            // Create new recipe
            recipe = await ProductRecipe.create({
                productId: productId,
                productName: product.name,
                sellerId: product.sellerId || req.user._id,
                rawMaterials: processedMaterials,
                productionTimeMinutes: productionTimeMinutes || 30,
                totalMaterialCost: roundedTotalCost,
                isActive: true
            });
            console.log('✅ Recipe created with', processedMaterials.length, 'materials');
        }
        
        // Update product with recipe info
        product.hasRecipe = true;
        product.recipeId = recipe._id;
        product.totalMaterialCost = roundedTotalCost;
        product.inventoryTrackingEnabled = true;
        
        // Calculate profit margin
        if (product.price > 0 && roundedTotalCost > 0) {
            const profit = product.price - roundedTotalCost;
            product.profitMargin = Math.round((profit / product.price) * 100);
        }
        
        await product.save();
        
        res.json({ 
            success: true, 
            recipe: recipe,
            totalCost: roundedTotalCost,
            materialCount: processedMaterials.length
        });
        
    } catch (error) {
        console.error('Save recipe error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// ==================== GET PRODUCT RECIPE ====================
router.get('/product/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;
        
        const recipe = await ProductRecipe.findOne({ productId })
            .populate('rawMaterials.materialId', 'name category unit costPerUnit');
        
        res.json({ 
            success: true, 
            recipe: recipe 
        });
    } catch (error) {
        console.error('Get recipe error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== DELETE PRODUCT RECIPE ====================
router.delete('/product/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;
        
        await ProductRecipe.findOneAndDelete({ productId });
        
        await Product.findByIdAndUpdate(productId, {
            hasRecipe: false,
            recipeId: null,
            totalMaterialCost: 0,
            inventoryTrackingEnabled: false,
            profitMargin: 0
        });
        
        res.json({ 
            success: true, 
            message: 'Recipe deleted successfully' 
        });
    } catch (error) {
        console.error('Delete recipe error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;