const Settings = require('../models/Settings');

// @desc    Get settings
// @route   GET /api/settings
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        
        // If no settings exist, create default
        if (!settings) {
            settings = await Settings.create({});
        }
        
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update general settings
// @route   PUT /api/settings/general
const updateGeneral = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }
        
        settings.general = {
            ...settings.general,
            ...req.body
        };
        
        await settings.save();
        
        res.json({
            success: true,
            message: 'General settings updated',
            data: settings.general
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update appearance settings
// @route   PUT /api/settings/appearance
const updateAppearance = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }
        
        settings.appearance = {
            ...settings.appearance,
            ...req.body
        };
        
        await settings.save();
        
        res.json({
            success: true,
            message: 'Appearance settings updated',
            data: settings.appearance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update notification settings
// @route   PUT /api/settings/notifications
const updateNotifications = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }
        
        settings.notifications = {
            ...settings.notifications,
            ...req.body
        };
        
        await settings.save();
        
        res.json({
            success: true,
            message: 'Notification settings updated',
            data: settings.notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update security settings
// @route   PUT /api/settings/security
const updateSecurity = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }
        
        settings.security = {
            ...settings.security,
            ...req.body
        };
        
        await settings.save();
        
        res.json({
            success: true,
            message: 'Security settings updated',
            data: settings.security
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update payment settings
// @route   PUT /api/settings/payment
const updatePayment = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }
        
        settings.payment = {
            ...settings.payment,
            ...req.body
        };
        
        await settings.save();
        
        res.json({
            success: true,
            message: 'Payment settings updated',
            data: settings.payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Change password
// @route   PUT /api/settings/password
const changePassword = async (req, res) => {
    try {
        // Password change logic here
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Upload logo
// @route   POST /api/settings/upload/logo
const uploadLogo = async (req, res) => {
    try {
        // File upload logic here
        res.json({
            success: true,
            message: 'Logo uploaded successfully',
            data: {
                logo: '/uploads/logo.png'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Upload favicon
// @route   POST /api/settings/upload/favicon
const uploadFavicon = async (req, res) => {
    try {
        // File upload logic here
        res.json({
            success: true,
            message: 'Favicon uploaded successfully',
            data: {
                favicon: '/uploads/favicon.ico'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getSettings,
    updateGeneral,
    updateAppearance,
    updateNotifications,
    updateSecurity,
    updatePayment,
    changePassword,
    uploadLogo,
    uploadFavicon
};