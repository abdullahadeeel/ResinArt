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
        enum: [
            'Resin', 'Hardener', 'Pigment', 'Dye', 'Mica Powder', 'Glitter', 'Flakes',
            'Dried Flowers', 'Preserved Flowers', 'Natural Elements', 'Mold', 'Tool',
            'Hardware', 'Finding', 'Packaging', 'Safety', 'Solvent', 'Adhesive',
            'Measuring', 'Mixing', 'Finishing', 'Color', 'Other'
        ],
        default: 'Other'
    },
    unit: {
        type: String,
        enum: ['ml', 'g', 'kg', 'piece', 'set', 'bottle', 'L', 'pack', 'jar', 'box', 'roll', 'sheet', 'pair', 'dozen', 'tube', 'can', 'bunch'],
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

// Virtual fields
rawMaterialSchema.virtual('totalValue').get(function() {
    return this.quantity * this.costPerUnit;
});

rawMaterialSchema.virtual('isLowStock').get(function() {
    return this.quantity <= this.minThreshold;
});

rawMaterialSchema.index({ sellerId: 1, createdAt: -1 });
rawMaterialSchema.index({ name: 'text', category: 'text' });

rawMaterialSchema.set('toJSON', { virtuals: true });
rawMaterialSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('RawMaterial', rawMaterialSchema);