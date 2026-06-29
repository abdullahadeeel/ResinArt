// backend/models/ProductRecipe.js
const mongoose = require('mongoose');

const recipeMaterialSchema = new mongoose.Schema({
    materialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RawMaterial',
        required: true
    },
    materialName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        default: 'piece'
    },
    wastageFactor: {
        type: Number,
        default: 0,
        min: 0,
        max: 500,  // ✅ Increased from 50 to 500
        comment: 'Percentage of extra material needed (e.g., 5 for 5% wastage)'
    }
});

const productRecipeSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        unique: true,
        comment: 'One recipe per product'
    },
    productName: {
        type: String,
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: false,  // ✅ Changed from true to false (optional for admin)
        default: null
    },
    rawMaterials: [recipeMaterialSchema],
    totalMaterialCost: {
        type: Number,
        default: 0,
        comment: 'Calculated sum of (quantity * costPerUnit)'
    },
    productionTimeMinutes: {
        type: Number,
        default: 30,
        comment: 'Time to make one product in minutes'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// ❌ REMOVED pre('save') middleware - This was causing "next is not a function" error
// The totalMaterialCost will be calculated in the route/controller instead

// ✅ Method to calculate total material cost (without next)
productRecipeSchema.methods.calculateTotalCost = async function() {
    const RawMaterial = mongoose.model('RawMaterial');
    let total = 0;
    
    for (const item of this.rawMaterials) {
        const material = await RawMaterial.findById(item.materialId);
        if (material) {
            const cost = material.costPerUnit * item.quantity;
            const withWastage = cost * (1 + (item.wastageFactor || 0) / 100);
            total += withWastage;
        }
    }
    
    this.totalMaterialCost = Math.round(total * 100) / 100;
    return this.totalMaterialCost;
};

// Method: check if enough materials available for given quantity
productRecipeSchema.methods.checkAvailability = async function(quantity) {
    const RawMaterial = mongoose.model('RawMaterial');
    const results = [];
    let isAvailable = true;
    
    for (const item of this.rawMaterials) {
        const material = await RawMaterial.findById(item.materialId);
        const requiredQty = item.quantity * quantity;
        const withWastage = requiredQty * (1 + (item.wastageFactor || 0) / 100);
        const finalRequired = Math.ceil(withWastage);
        const availableQty = material ? material.quantity : 0;
        
        results.push({
            materialId: item.materialId,
            materialName: item.materialName,
            required: finalRequired,
            available: availableQty,
            isAvailable: availableQty >= finalRequired
        });
        
        if (availableQty < finalRequired) {
            isAvailable = false;
        }
    }
    
    return {
        isAvailable: isAvailable,
        details: results
    };
};

module.exports = mongoose.model('ProductRecipe', productRecipeSchema);