// backend/models/Order.js
const mongoose = require('mongoose');

// Status History Schema
const statusHistorySchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String,
        default: ''
    },
    updatedBy: {
        type: String,
        enum: ['user', 'seller', 'admin', 'system'],
        default: 'system'
    },
    updatedById: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Refund Details Schema
const refundDetailsSchema = new mongoose.Schema({
    isRefunded: {
        type: Boolean,
        default: false
    },
    refundAmount: {
        type: Number,
        default: 0
    },
    refundReason: {
        type: String,
        default: ''
    },
    refundedAt: {
        type: Date,
        default: null
    },
    refundedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller'
    },
    refundNote: {
        type: String,
        default: ''
    }
});

// Admin Notes Schema
const adminNoteSchema = new mongoose.Schema({
    note: {
        type: String,
        required: true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

// TCS Details Schema
const tcsDetailsSchema = new mongoose.Schema({
    trackingId: {
        type: String,
        default: null
    },
    addedAt: {
        type: Date,
        default: null
    },
    addedBy: {
        type: String,
        enum: ['seller', 'admin'],
        default: null
    },
    shippingCharge: {
        type: Number,
        default: 0
    },
    codCharge: {
        type: Number,
        default: 0
    },
    totalDeduction: {
        type: Number,
        default: 0
    },
    isAdded: {
        type: Boolean,
        default: false
    }
});

// Main Order Schema
const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        productId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            default: ''
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        isCustom: {
            type: Boolean,
            default: false
        },
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Seller',
            default: null
        },
        sellerName: {
            type: String,
            default: ''
        }
    }],
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        default: 0
    },
    shippingFee: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cod'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'],
        default: 'pending'
    },
    statusHistory: [statusHistorySchema],
    
    // TCS Details (Updated with charges)
    tcsDetails: {
        type: tcsDetailsSchema,
        default: () => ({})
    },
    
    // Legacy TCS fields (keep for compatibility)
    tcsTrackingId: {
        type: String,
        default: null
    },
    tcsTrackingAddedAt: {
        type: Date,
        default: null
    },
    tcsTrackingAddedBy: {
        type: String,
        enum: ['seller', 'admin'],
        default: null
    },
    
    // New TCS Charges Fields
    tcsShippingCharge: {
        type: Number,
        default: 0
    },
    tcsCodCharge: {
        type: Number,
        default: 0
    },
    tcsTotalDeduction: {
        type: Number,
        default: 0
    },
    isTcsChargeAdded: {
        type: Boolean,
        default: false
    },
    
    refundDetails: {
        type: refundDetailsSchema,
        default: () => ({})
    },
    adminNotes: [adminNoteSchema],
    shippingAddress: {
        fullName: { type: String, default: '' },
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        zipCode: { type: String, default: '' },
        country: { type: String, default: 'Pakistan' },
        phone: { type: String, default: '' },
        email: { type: String, default: '' }
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        default: null,
        index: true
    },
    inventoryDeducted: {
        type: Boolean,
        default: false
    },
    inventoryDeductedAt: {
        type: Date,
        default: null
    },
    inventoryRolledBack: {
        type: Boolean,
        default: false
    },
    inventoryRolledBackAt: {
        type: Date,
        default: null
    },
    inventoryNotes: {
        type: String,
        default: ''
    },
    statusNotes: [{
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded']
        },
        note: {
            type: String,
            default: ''
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    notes: {
        type: String,
        default: ''
    },
    deliveredAt: {
        type: Date,
        default: null
    },
    cancelledAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// ==================== VIRTUAL FIELDS ====================
orderSchema.virtual('isInventoryDeducted').get(function() {
    return this.inventoryDeducted === true;
});

orderSchema.virtual('isCancellable').get(function() {
    return ['pending', 'processing', 'confirmed'].includes(this.orderStatus);
});

orderSchema.virtual('canBeRefunded').get(function() {
    return this.orderStatus === 'delivered' && !this.refundDetails?.isRefunded;
});

orderSchema.virtual('hasTrackingId').get(function() {
    return (this.tcsTrackingId !== null && this.tcsTrackingId !== '') || 
           (this.tcsDetails?.trackingId !== null && this.tcsDetails?.trackingId !== '');
});

orderSchema.virtual('trackingUrl').get(function() {
    const trackingId = this.tcsTrackingId || this.tcsDetails?.trackingId;
    if (trackingId) {
        return `https://www.tcsexpress.com/tracking?tracking_number=${trackingId}`;
    }
    return null;
});

// Virtual for net earnings (after TCS deductions)
orderSchema.virtual('netEarnings').get(function() {
    const deduction = this.tcsTotalDeduction || 
                      (this.tcsDetails?.totalDeduction || 0);
    return (this.totalAmount || 0) - deduction;
});

// Virtual for TCS deduction summary
orderSchema.virtual('tcsDeductionSummary').get(function() {
    return {
        shippingCharge: this.tcsShippingCharge || this.tcsDetails?.shippingCharge || 0,
        codCharge: this.tcsCodCharge || this.tcsDetails?.codCharge || 0,
        total: this.tcsTotalDeduction || this.tcsDetails?.totalDeduction || 0
    };
});

// ==================== METHODS ====================

// Add status with history
orderSchema.methods.addStatusWithHistory = function(status, note, updatedBy, updatedById) {
    this.orderStatus = status;
    this.statusHistory.push({
        status: status,
        note: note || `Status changed to ${status}`,
        timestamp: new Date(),
        updatedBy: updatedBy || 'system',
        updatedById: updatedById || null
    });
    this.statusNotes.push({
        status: status,
        note: note || `Status changed to ${status}`,
        updatedBy: updatedById,
        updatedAt: Date.now()
    });
    if (status === 'delivered') {
        this.deliveredAt = new Date();
    }
    if (status === 'cancelled') {
        this.cancelledAt = new Date();
    }
    return this;
};

// Add TCS Tracking with charges
orderSchema.methods.addTcsTracking = function(trackingId, addedBy, shippingCharge, codCharge) {
    const shipping = shippingCharge || 0;
    const cod = codCharge || 0;
    const total = shipping + cod;
    
    // Update new fields
    this.tcsTrackingId = trackingId;
    this.tcsTrackingAddedAt = new Date();
    this.tcsTrackingAddedBy = addedBy;
    this.tcsShippingCharge = shipping;
    this.tcsCodCharge = cod;
    this.tcsTotalDeduction = total;
    this.isTcsChargeAdded = true;
    
    // Update nested details
    this.tcsDetails = {
        trackingId: trackingId,
        addedAt: new Date(),
        addedBy: addedBy,
        shippingCharge: shipping,
        codCharge: cod,
        totalDeduction: total,
        isAdded: true
    };
    
    return this;
};

// Get net earnings after TCS deductions
orderSchema.methods.getNetEarnings = function() {
    const deduction = this.tcsTotalDeduction || 0;
    return (this.totalAmount || 0) - deduction;
};

// Process Refund
orderSchema.methods.processRefund = function(amount, reason, sellerId, note) {
    this.refundDetails = {
        isRefunded: true,
        refundAmount: amount || this.totalAmount,
        refundReason: reason || 'No reason provided',
        refundedAt: new Date(),
        refundedBy: sellerId,
        refundNote: note || ''
    };
    this.orderStatus = 'refunded';
    this.statusHistory.push({
        status: 'refunded',
        note: `Refund processed: ${reason}`,
        timestamp: new Date(),
        updatedBy: 'seller',
        updatedById: sellerId
    });
    return this;
};

// Add Admin Note
orderSchema.methods.addAdminNote = function(note, adminId) {
    this.adminNotes.push({
        note: note,
        addedBy: adminId,
        addedAt: new Date()
    });
    return this;
};

// Legacy method
orderSchema.methods.addStatusNote = function(status, note, userId) {
    this.statusNotes.push({
        status: status,
        note: note,
        updatedBy: userId,
        updatedAt: Date.now()
    });
    this.statusHistory.push({
        status: status,
        note: note,
        timestamp: new Date(),
        updatedBy: userId ? 'seller' : 'system',
        updatedById: userId
    });
    this.orderStatus = status;
    return this;
};

orderSchema.methods.markInventoryDeducted = function() {
    this.inventoryDeducted = true;
    this.inventoryDeductedAt = Date.now();
    return this;
};

orderSchema.methods.markInventoryRolledBack = function() {
    this.inventoryRolledBack = true;
    this.inventoryRolledBackAt = Date.now();
    return this;
};

// ==================== PRE-SAVE HOOK ====================
orderSchema.pre('save', function(next) {
    if (!this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.orderNumber = `RESIN-${year}${month}${day}-${random}`;
    }
});

module.exports = mongoose.model('Order', orderSchema);