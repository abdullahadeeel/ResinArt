const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    general: {
        storeName: { type: String, default: 'Resin Art Studio' },
        storeEmail: { type: String, default: 'info@resinart.com' },
        storePhone: { type: String, default: '+92 300 1234567' },
        address: { type: String, default: 'Lahore, Pakistan' },
        currency: { type: String, default: 'PKR' },
        timezone: { type: String, default: 'Asia/Karachi' },
        dateFormat: { type: String, default: 'DD/MM/YYYY' }
    },
    appearance: {
        theme: { type: String, default: 'light' },
        primaryColor: { type: String, default: '#f59e0b' },
        logo: { type: String, default: '' },
        favicon: { type: String, default: '' },
        itemsPerPage: { type: Number, default: 20 },
        fontSize: { type: String, default: 'medium' },
        sidebarCollapsed: { type: Boolean, default: false },
        animations: { type: Boolean, default: true }
    },
    notifications: {
        emailNotifications: { type: Boolean, default: true },
        orderUpdates: { type: Boolean, default: true },
        newUserAlerts: { type: Boolean, default: true },
        lowStockAlerts: { type: Boolean, default: true },
        weeklyReports: { type: Boolean, default: false },
        smsNotifications: { type: Boolean, default: false },
        pushNotifications: { type: Boolean, default: true }
    },
    security: {
        twoFactorAuth: { type: Boolean, default: false },
        sessionTimeout: { type: Number, default: 30 },
        passwordExpiry: { type: Number, default: 90 },
        loginAttempts: { type: Number, default: 5 },
        ipWhitelist: { type: [String], default: [] },
        requireStrongPassword: { type: Boolean, default: true },
        autoLogout: { type: Boolean, default: true },
        loginNotifications: { type: Boolean, default: true }
    },
    payment: {
        stripeEnabled: { type: Boolean, default: true },
        paypalEnabled: { type: Boolean, default: false },
        cashOnDelivery: { type: Boolean, default: true },
        bankTransfer: { type: Boolean, default: false },
        taxRate: { type: Number, default: 10 },
        shippingFee: { type: Number, default: 5.99 },
        freeShippingThreshold: { type: Number, default: 50 },
        taxIncluded: { type: Boolean, default: false },
        paymentMethods: { type: [String], default: ['stripe', 'cod'] },
        acceptedCards: { type: [String], default: ['visa', 'mastercard'] }
    },
    
    features: {
        cancelOrderHours: { type: Number, default: 24 },
        bulkDiscountMinQuantity: { type: Number, default: 3 },
        bulkDiscountPercent: { type: Number, default: 5 },
        loyaltyPointsPerOrder: { type: Number, default: 10 },
        loyaltyPointsPerRupee: { type: Number, default: 1 },
        giftWrappingFee: { type: Number, default: 150 }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);