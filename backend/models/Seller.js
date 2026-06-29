const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    shopName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ''
    },
    shopDescription: {
        type: String,
        default: ''
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: { type: String, default: 'Pakistan' }
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    productIds: [{                           // ✅ 'products' se 'productIds' change kiya
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    totalSales: {
        type: Number,
        default: 0
    },
    totalRevenue: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// ✅ FIXED: Hash password before saving (NO 'next' parameter)
sellerSchema.pre('save', async function() {
    // Only hash password if it's modified
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    // timestamps true hai to updatedAt auto update ho jayega
});

module.exports = mongoose.model('Seller', sellerSchema);