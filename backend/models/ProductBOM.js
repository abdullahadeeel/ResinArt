// backend/models/ProductBOM.js

const mongoose = require('mongoose');

const productBOMSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    materials: [{
        materialId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RawMaterial',
            required: true
        },
        materialName: {
            type: String,
            required: true
        },
        quantityRequired: {
            type: Number,
            required: true,
            min: 0
        },
        unit: {
            type: String,
            default: 'piece'
        },
        costPerUnit: {
            type: Number,
            default: 0
        },
        totalCost: {
            type: Number,
            default: 0
        }
    }],
    totalManufacturingCost: {
        type: Number,
        default: 0
    },
    profitMargin: {
        type: Number,
        default: 30
    },
    suggestedPrice: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Calculate total manufacturing cost before save
productBOMSchema.pre('save', function(next) {
    this.totalManufacturingCost = this.materials.reduce((sum, m) => sum + (m.quantityRequired * m.costPerUnit), 0);
    this.suggestedPrice = this.totalManufacturingCost * (1 + this.profitMargin / 100);
    next();
});

productBOMSchema.index({ productId: 1, sellerId: 1 });

module.exports = mongoose.model('ProductBOM', productBOMSchema);