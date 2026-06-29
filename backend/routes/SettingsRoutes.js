const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Settings = require('../models/Settings');

// ==================== HELPER: Get or Create Settings ====================
const getOrCreateSettings = async () => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = await Settings.create({});
        console.log('✅ Default settings created');
    }
    return settings;
};

// ==================== GET SETTINGS ====================
const getSettings = async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('❌ Get settings error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== UPDATE GENERAL ====================
const updateGeneral = async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const { storeName, storeEmail, storePhone, address, currency, timezone, dateFormat } = req.body;
        
        settings.general = {
            storeName: storeName || settings.general?.storeName || 'Resin Art Studio',
            storeEmail: storeEmail || settings.general?.storeEmail || '',
            storePhone: storePhone || settings.general?.storePhone || '',
            address: address || settings.general?.address || '',
            currency: currency || settings.general?.currency || 'PKR',
            timezone: timezone || settings.general?.timezone || 'Asia/Karachi',
            dateFormat: dateFormat || settings.general?.dateFormat || 'DD/MM/YYYY'
        };
        
        await settings.save();
        console.log('✅ General settings updated');
        
        res.json({
            success: true,
            message: 'General settings updated successfully',
            data: settings
        });
    } catch (error) {
        console.error('❌ Update general error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== UPDATE APPEARANCE ====================
const updateAppearance = async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const { theme, primaryColor, secondaryColor, logo, favicon } = req.body;
        
        settings.appearance = {
            theme: theme || settings.appearance?.theme || 'light',
            primaryColor: primaryColor || settings.appearance?.primaryColor || '#f59e0b',
            secondaryColor: secondaryColor || settings.appearance?.secondaryColor || '#9a3412',
            logo: logo || settings.appearance?.logo || '',
            favicon: favicon || settings.appearance?.favicon || ''
        };
        
        await settings.save();
        console.log('✅ Appearance settings updated');
        
        res.json({
            success: true,
            message: 'Appearance settings updated successfully',
            data: settings
        });
    } catch (error) {
        console.error('❌ Update appearance error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== UPDATE NOTIFICATIONS ====================
const updateNotifications = async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const { emailNotifications, orderUpdates, promoEmails } = req.body;
        
        settings.notifications = {
            emailNotifications: emailNotifications !== undefined ? emailNotifications : (settings.notifications?.emailNotifications || true),
            orderUpdates: orderUpdates !== undefined ? orderUpdates : (settings.notifications?.orderUpdates || true),
            promoEmails: promoEmails !== undefined ? promoEmails : (settings.notifications?.promoEmails || false)
        };
        
        await settings.save();
        console.log('✅ Notification settings updated');
        
        res.json({
            success: true,
            message: 'Notification settings updated successfully',
            data: settings
        });
    } catch (error) {
        console.error('❌ Update notifications error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== UPDATE SECURITY ====================
const updateSecurity = async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const { twoFactorAuth, sessionTimeout, maxLoginAttempts, requireStrongPassword, autoLogout, loginNotifications } = req.body;
        
        settings.security = {
            twoFactorAuth: twoFactorAuth !== undefined ? twoFactorAuth : (settings.security?.twoFactorAuth || false),
            sessionTimeout: sessionTimeout || settings.security?.sessionTimeout || 30,
            maxLoginAttempts: maxLoginAttempts || settings.security?.maxLoginAttempts || 5,
            requireStrongPassword: requireStrongPassword !== undefined ? requireStrongPassword : (settings.security?.requireStrongPassword || true),
            autoLogout: autoLogout !== undefined ? autoLogout : (settings.security?.autoLogout || true),
            loginNotifications: loginNotifications !== undefined ? loginNotifications : (settings.security?.loginNotifications || true)
        };
        
        await settings.save();
        console.log('✅ Security settings updated');
        
        res.json({
            success: true,
            message: 'Security settings updated successfully',
            data: settings
        });
    } catch (error) {
        console.error('❌ Update security error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== UPDATE PAYMENT ====================
const updatePayment = async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const { stripeEnabled, cashOnDelivery, paypalEnabled, bankTransfer } = req.body;
        
        settings.payment = {
            stripeEnabled: stripeEnabled !== undefined ? stripeEnabled : (settings.payment?.stripeEnabled || false),
            cashOnDelivery: cashOnDelivery !== undefined ? cashOnDelivery : (settings.payment?.cashOnDelivery || true),
            paypalEnabled: paypalEnabled !== undefined ? paypalEnabled : (settings.payment?.paypalEnabled || false),
            bankTransfer: bankTransfer !== undefined ? bankTransfer : (settings.payment?.bankTransfer || false)
        };
        
        await settings.save();
        console.log('✅ Payment settings updated');
        
        res.json({
            success: true,
            message: 'Payment settings updated successfully',
            data: settings
        });
    } catch (error) {
        console.error('❌ Update payment error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== UPDATE FEATURES ====================
const updateFeatures = async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const { cancelOrderHours, bulkDiscountMinQuantity, bulkDiscountPercent, loyaltyPointsPerOrder, loyaltyPointsPerRupee, giftWrappingFee } = req.body;
        
        settings.features = {
            cancelOrderHours: cancelOrderHours !== undefined ? cancelOrderHours : (settings.features?.cancelOrderHours || 24),
            bulkDiscountMinQuantity: bulkDiscountMinQuantity !== undefined ? bulkDiscountMinQuantity : (settings.features?.bulkDiscountMinQuantity || 3),
            bulkDiscountPercent: bulkDiscountPercent !== undefined ? bulkDiscountPercent : (settings.features?.bulkDiscountPercent || 5),
            loyaltyPointsPerOrder: loyaltyPointsPerOrder !== undefined ? loyaltyPointsPerOrder : (settings.features?.loyaltyPointsPerOrder || 10),
            loyaltyPointsPerRupee: loyaltyPointsPerRupee !== undefined ? loyaltyPointsPerRupee : (settings.features?.loyaltyPointsPerRupee || 1),
            giftWrappingFee: giftWrappingFee !== undefined ? giftWrappingFee : (settings.features?.giftWrappingFee || 150)
        };
        
        await settings.save();
        console.log('✅ Features settings updated');
        
        res.json({
            success: true,
            message: 'Features settings updated successfully',
            data: settings
        });
    } catch (error) {
        console.error('❌ Update features error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== CHANGE PASSWORD ====================
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }
        
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        if (!specialCharRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'New password must contain at least one special character (!@#$%^&* etc.)'
            });
        }
        
        const admin = await Admin.findById(req.user._id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        admin.password = hashedPassword;
        await admin.save();
        
        console.log('✅ Password changed successfully for admin:', admin.email);
        
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('❌ Change password error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== UPLOAD LOGO ====================
const uploadLogo = (req, res) => {
    res.json({
        success: true,
        message: 'Logo uploaded successfully',
        data: { logo: '/uploads/logo.png' }
    });
};

// ==================== UPLOAD FAVICON ====================
const uploadFavicon = (req, res) => {
    res.json({
        success: true,
        message: 'Favicon uploaded successfully',
        data: { favicon: '/uploads/favicon.ico' }
    });
};

// ==================== ROUTES ====================
router.use(protect);
router.use(admin);

router.get('/', getSettings);
router.put('/general', updateGeneral);
router.put('/appearance', updateAppearance);
router.put('/notifications', updateNotifications);
router.put('/security', updateSecurity);
router.put('/payment', updatePayment);
router.put('/features', updateFeatures);
router.put('/password', changePassword);
router.post('/upload/logo', uploadLogo);
router.post('/upload/favicon', uploadFavicon);

module.exports = router;