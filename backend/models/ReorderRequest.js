// backend/models/ReorderRequest.js
const mongoose = require('mongoose');

const reorderRequestSchema = new mongoose.Schema({
    materialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RawMaterial',
        required: true
    },
    materialName: {
        type: String,
        required: true
    },
    requestedQuantity: {
        type: Number,
        required: true,
        min: 1
    },
    currentStock: {
        type: Number,
        required: true
    },
    threshold: {
        type: Number,
        required: true
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
    status: {
        type: String,
        enum: ['pending', 'approved', 'ordered', 'received', 'rejected', 'cancelled'],
        default: 'pending'
    },
    adminNotes: {
        type: String,
        default: ''
    },
    sellerNotes: {
        type: String,
        default: ''
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    approvedAt: {
        type: Date,
        default: null
    },
    orderPlacedAt: {
        type: Date,
        default: null
    },
    orderPlacedBy: {
        type: String,
        default: '',
        comment: 'Admin or Seller who placed the order'
    },
    expectedDeliveryDate: {
        type: Date,
        default: null
    },
    receivedAt: {
        type: Date,
        default: null
    },
    trackingNumber: {
        type: String,
        default: ''
    },
    actualCost: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Virtual: isUrgent (if stock is 0 or very low)
reorderRequestSchema.virtual('isUrgent').get(function() {
    return this.currentStock === 0;
});

// Virtual: daysPending
reorderRequestSchema.virtual('daysPending').get(function() {
    if (this.status !== 'pending') return 0;
    const days = (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24);
    return Math.round(days);
});

module.exports = mongoose.model('ReorderRequest', reorderRequestSchema);