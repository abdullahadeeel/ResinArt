// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: ['Trays', 'Coasters', 'Jewelry', 'Nameplates', 'Home Decor', 'Gifts', 'Other']
    },
    images: [{
        type: String,
        default: []
    }],
    stock: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    
    // ✅ EXISTING FIELDS (Keep them)
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sellerName: {
        type: String,
        default: 'Admin'
    },
    
    // ✅ ADD THIS NEW FIELD - For order controller to work
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: false  // false for existing products, but should be set
    },
    
    isActive: {
        type: Boolean,
        default: true
    },
    isApproved: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    
    // ========== REVIEWS FIELDS ==========
    averageRating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    
    // ========== INVENTORY SYSTEM FIELDS ==========
    hasRecipe: {
        type: Boolean,
        default: false
    },
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductRecipe',
        default: null
    },
    totalMaterialCost: {
        type: Number,
        default: 0
    },
    profitMargin: {
        type: Number,
        default: 0
    },
    inventoryTrackingEnabled: {
        type: Boolean,
        default: false
    }
});

// ========== VIRTUAL FIELDS ==========
productSchema.virtual('calculatedProfitMargin').get(function() {
    if (this.price <= 0 || this.totalMaterialCost <= 0) return 0;
    const profit = this.price - this.totalMaterialCost;
    return Math.round((profit / this.price) * 100);
});

productSchema.virtual('isRecipeComplete').get(function() {
    return this.hasRecipe === true && this.recipeId !== null;
});

// ========== METHODS ==========
productSchema.methods.updateProfitMargin = function() {
    if (this.price > 0 && this.totalMaterialCost > 0) {
        const profit = this.price - this.totalMaterialCost;
        this.profitMargin = Math.round((profit / this.price) * 100);
    } else {
        this.profitMargin = 0;
    }
    return this.profitMargin;
};

productSchema.methods.checkRawMaterialAvailability = async function(quantity) {
    if (!this.hasRecipe || !this.recipeId) {
        return { isAvailable: true, message: 'No recipe setup, skipping inventory check' };
    }
    
    const ProductRecipe = mongoose.model('ProductRecipe');
    const recipe = await ProductRecipe.findById(this.recipeId);
    
    if (!recipe) {
        return { isAvailable: true, message: 'Recipe not found, skipping inventory check' };
    }
    
    return await recipe.checkAvailability(quantity);
};

// ========== STATIC METHODS ==========
productSchema.statics.findProductsWithLowMaterialStock = async function() {
    const ProductRecipe = mongoose.model('ProductRecipe');
    const RawMaterial = mongoose.model('RawMaterial');
    
    const products = await this.find({ hasRecipe: true, isActive: true });
    const lowStockProducts = [];
    
    for (const product of products) {
        const recipe = await ProductRecipe.findById(product.recipeId);
        if (recipe) {
            let hasLowStock = false;
            for (const item of recipe.rawMaterials) {
                const material = await RawMaterial.findById(item.materialId);
                if (material && material.quantity <= material.minThreshold) {
                    hasLowStock = true;
                    break;
                }
            }
            if (hasLowStock) {
                lowStockProducts.push({
                    productId: product._id,
                    productName: product.name,
                    recipeId: product.recipeId
                });
            }
        }
    }
    
    return lowStockProducts;
};

module.exports = mongoose.model('Product', productSchema);