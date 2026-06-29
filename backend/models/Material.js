// backend/models/RawMaterial.js

const mongoose = require('mongoose');

const rawMaterialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Material name is required'],
        trim: true
    },
    category: {
        type: String,
        enum: ['Resin', 'Hardener', 'Color', 'Mold', 'Tool', 'Packaging', 'Other'],
        default: 'Other'
    },
    unit: {
        type: String,
        enum: ['ml', 'g', 'kg', 'piece', 'set', 'bottle', 'L'],
        default: 'piece'
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    minThreshold: {
        type: Number,
        default: 10,
        min: 0
    },
    costPerUnit: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    supplierName: {
        type: String,
        default: ''
    },
    supplierLink: {
        type: String,
        default: ''
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    sellerName: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'discontinued'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Virtual field for total value
rawMaterialSchema.virtual('totalValue').get(function() {
    return this.quantity * this.costPerUnit;
});

// Virtual field for low stock check
rawMaterialSchema.virtual('isLowStock').get(function() {
    return this.quantity <= this.minThreshold;
});

// Index for search
rawMaterialSchema.index({ name: 'text', category: 'text' });
rawMaterialSchema.index({ sellerId: 1, createdAt: -1 });

rawMaterialSchema.set('toJSON', { virtuals: true });
rawMaterialSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('RawMaterial', rawMaterialSchema);