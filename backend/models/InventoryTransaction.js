// backend/models/InventoryTransaction.js

const mongoose = require('mongoose');

const inventoryTransactionSchema = new mongoose.Schema({
    materialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RawMaterial',
        required: true
    },
    materialName: {
        type: String,
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null
    },
    productName: {
        type: String,
        default: ''
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: null
    },
    type: {
        type: String,
        enum: ['add', 'deduct', 'order_deduct', 'restock', 'adjust'],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    previousQuantity: {
        type: Number,
        required: true
    },
    newQuantity: {
        type: Number,
        required: true
    },
    note: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

inventoryTransactionSchema.index({ sellerId: 1, createdAt: -1 });
inventoryTransactionSchema.index({ materialId: 1, createdAt: -1 });

module.exports = mongoose.model('InventoryTransaction', inventoryTransactionSchema);