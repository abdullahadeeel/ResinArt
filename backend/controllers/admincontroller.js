const Admin = require('../models/Admin');
const User = require('../models/user');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Seller = require('../models/Seller');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ==================== AUTHENTICATION ====================

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            { id: admin._id, role: 'admin' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone || '',
                profilePicture: admin.profilePicture || '',
                role: 'admin',
                token
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({
                success: false,
                message: 'Admin already exists'
            });
        }

        const admin = await Admin.create({
            name,
            email,
            password
        });

        const token = jwt.sign(
            { id: admin._id, role: 'admin' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone || '',
                profilePicture: admin.profilePicture || '',
                role: 'admin',
                token
            }
        });
    } catch (error) {
        console.error('Admin register error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== ADMIN PROFILE ====================

const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user._id).select('-password');
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        res.json({
            success: true,
            data: admin
        });
    } catch (error) {
        console.error('Get admin profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateAdminProfile = async (req, res) => {
    try {
        const { name, phone, profilePicture } = req.body;
        
        const admin = await Admin.findById(req.user._id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        
        if (name) admin.name = name;
        if (phone) admin.phone = phone;
        if (profilePicture) admin.profilePicture = profilePicture;
        
        await admin.save();
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
                profilePicture: admin.profilePicture,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Update admin profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const changeAdminPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
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
        admin.password = await bcrypt.hash(newPassword, salt);
        await admin.save();
        
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change admin password error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const uploadAdminProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }
        
        const imageUrl = `/uploads/${req.file.filename}`;
        
        const admin = await Admin.findByIdAndUpdate(
            req.user._id,
            { profilePicture: imageUrl },
            { new: true }
        ).select('-password');
        
        res.json({
            success: true,
            message: 'Profile picture uploaded',
            data: { imageUrl }
        });
    } catch (error) {
        console.error('Upload profile picture error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== DASHBOARD ====================

const getDashboardStats = async (req, res) => {
    try {
        console.log('🚀🚀🚀 NEW FUNCTION IS RUNNING! 🚀🚀🚀');

        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        const revenueResult = await Order.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email');

        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('-password');

        const pendingProducts = await Product.countDocuments({ isApproved: false });
        const pendingSellers = await Seller.countDocuments({ isApproved: false });

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const monthlyRevenueData = await Order.aggregate([
            { 
                $match: { 
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyRevenue = monthlyRevenueData.map(item => ({
            month: monthNames[item._id.month - 1],
            revenue: item.revenue
        }));

        const ordersByStatusData = await Order.aggregate([
            {
                $group: {
                    _id: '$orderStatus',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const ordersByStatus = ordersByStatusData.map(item => ({
            _id: item._id || 'pending',
            count: item.count
        }));

        console.log('✅ monthlyRevenue:', JSON.stringify(monthlyRevenue));
        console.log('✅ ordersByStatus:', JSON.stringify(ordersByStatus));

        res.json({
            success: true,
            data: {
                stats: {
                    users: totalUsers,
                    products: totalProducts,
                    orders: totalOrders,
                    revenue: totalRevenue,
                    pendingProducts: pendingProducts,
                    pendingSellers: pendingSellers
                },
                recentOrders: recentOrders || [],
                recentUsers: recentUsers || [],
                monthlyRevenue: monthlyRevenue || [],
                ordersByStatus: ordersByStatus || []
            }
        });

    } catch (error) {
        console.error('❌ Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== PRODUCT MANAGEMENT ====================

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate('sellerId', 'name shopName')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const approveProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        product.isApproved = true;
        await product.save();
        res.json({
            success: true,
            message: 'Product approved successfully',
            data: product
        });
    } catch (error) {
        console.error('Approve product error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const rejectProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        product.isApproved = false;
        product.isActive = false;
        await product.save();
        res.json({
            success: true,
            message: 'Product rejected',
            data: product
        });
    } catch (error) {
        console.error('Reject product error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
        res.json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        await product.deleteOne();
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== SELLER MANAGEMENT ====================




const getAllSellers = async (req, res) => {
    try {
        const sellers = await Seller.find({}).select('-password').sort({ createdAt: -1 });
         const sellersWithCount = await Promise.all(sellers.map(async (seller) => {
            const productsCount = await Product.countDocuments({ sellerId: seller._id });
            return {
                ...seller.toObject(),
                productsCount: productsCount
            };
        }));
        
        
        res.json({
            success: true,
            data: sellers
        });
    } catch (error) {
        console.error('Get sellers error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// ==================== SELLER MANAGEMENT ====================


const getSellerDetails = async (req, res) => {
    try {
        const seller = await Seller.findById(req.params.id).select('-password');
        
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }
        
        // ✅ Get products count
        const productsCount = await Product.countDocuments({ sellerId: seller._id });
        
        // ✅ Get orders for this seller
        const orders = await Order.find({ sellerId: seller._id });
        
        // ✅ Calculate total revenue and sales
        let totalRevenue = 0;
        let totalSales = orders.length;
        
        orders.forEach(order => {
            totalRevenue += order.totalAmount || 0;
        });
        
        // ✅ Get product list
        const products = await Product.find({ sellerId: seller._id })
            .select('name price images')
            .limit(10);
        
        res.json({
            success: true,
            data: {
                _id: seller._id,
                name: seller.name,
                email: seller.email,
                phone: seller.phone,
                shopName: seller.shopName,
                shopDescription: seller.shopDescription,
                address: seller.address,
                profilePicture: seller.profilePicture,
                isApproved: seller.isApproved,
                createdAt: seller.createdAt,
                updatedAt: seller.updatedAt,
                products: products || [],
                productsCount: productsCount,
                totalSales: totalSales,
                totalRevenue: totalRevenue,
                rating: seller.rating || 0
            }
        });
    } catch (error) {
        console.error('Get seller details error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const approveSeller = async (req, res) => {
    try {
        const seller = await Seller.findById(req.params.id);
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }
        seller.isApproved = true;
        await seller.save();
        res.json({
            success: true,
            message: 'Seller approved successfully',
            data: seller
        });
    } catch (error) {
        console.error('Approve seller error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteSeller = async (req, res) => {
    try {
        const seller = await Seller.findById(req.params.id);
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }
        await seller.deleteOne();
        res.json({
            success: true,
            message: 'Seller deleted successfully'
        });
    } catch (error) {
        console.error('Delete seller error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== ORDER MANAGEMENT ====================

const getAllOrders = async (req, res) => {
    try {
        const { status, sellerId, limit = 100 } = req.query;
        
        let query = {};
        if (status && status !== 'all') {
            query.orderStatus = status;
        }
        if (sellerId) {
            query.sellerId = sellerId;
        }
        
        const orders = await Order.find(query)
            .populate('user', 'name email phone')
            .populate('sellerId', 'name shopName')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));
        
        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAdminOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('sellerId', 'name shopName email phone')
            .populate('products.productId', 'name images');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Get order by id error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getOrdersBySeller = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const { status } = req.query;
        
        let query = { sellerId: sellerId };
        if (status && status !== 'all') {
            query.orderStatus = status;
        }
        
        const orders = await Order.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        
        const stats = {
            totalOrders: orders.length,
            totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
            pendingOrders: orders.filter(o => o.orderStatus === 'pending').length,
            completedOrders: orders.filter(o => o.orderStatus === 'delivered').length,
            cancelledOrders: orders.filter(o => o.orderStatus === 'cancelled').length
        };
        
        res.json({
            success: true,
            stats: stats,
            data: orders
        });
    } catch (error) {
        console.error('Get orders by seller error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const addAdminOrderNote = async (req, res) => {
    try {
        const { note } = req.body;
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        order.adminNotes = order.adminNotes || [];
        order.adminNotes.push({
            note: note,
            addedBy: req.user._id,
            addedAt: new Date()
        });
        await order.save();
        
        res.json({
            success: true,
            message: 'Note added successfully'
        });
    } catch (error) {
        console.error('Add note error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== USER MANAGEMENT ====================

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin users'
            });
        }

        await user.deleteOne();
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.phone = req.body.phone || user.phone;

        await user.save();
        res.json({
            success: true,
            message: 'User updated successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== REPORTS (ADMIN) ====================

const getAdminOverviewReport = async (req, res) => {
    try {
        console.log('🚀 REPORTS API CALLED');

        const { startDate, endDate } = req.query;
        
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const totalUsers = await User.countDocuments(dateFilter);
        const totalProducts = await Product.countDocuments(dateFilter);
        const totalOrders = await Order.countDocuments(dateFilter);
        
        const revenueResult = await Order.aggregate([
            { $match: { ...dateFilter } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        console.log('📊 Total Orders:', totalOrders);
        console.log('📊 Total Revenue:', totalRevenue);

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const monthlyRevenueData = await Order.aggregate([
            { 
                $match: { 
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyRevenue = monthlyRevenueData.map(item => ({
            month: monthNames[item._id.month - 1],
            revenue: item.revenue
        }));

        let categorySales = [];
        try {
            categorySales = await Order.aggregate([
                { $match: dateFilter },
                { $unwind: { path: '$products', preserveNullAndEmptyArrays: false } },
                { $group: {
                    _id: '$products.category',
                    value: { $sum: { $multiply: ['$products.price', '$products.quantity'] } },
                    count: { $sum: '$products.quantity' }
                }},
                { $sort: { value: -1 } },
                { $limit: 5 }
            ]);
        } catch (err) {
            console.log('Category error:', err.message);
        }

        const ordersByStatus = await Order.aggregate([
            { $match: dateFilter },
            { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
        ]);

        // ✅ PRODUCTS LIST
        const productsList = await Product.find(dateFilter)
            .select('name price stock images isActive')
            .limit(20)
            .sort({ createdAt: -1 });

        // ✅ USERS LIST
        const usersList = await User.find(dateFilter)
            .select('name email phone role isActive createdAt')
            .limit(20)
            .sort({ createdAt: -1 });

        console.log('✅ Products count:', productsList.length);
        console.log('✅ Users count:', usersList.length);

        res.json({
            success: true,
            data: {
                stats: {
                    users: totalUsers,
                    products: totalProducts,
                    orders: totalOrders,
                    revenue: totalRevenue,
                    pendingProducts: 0,
                    pendingSellers: 0
                },
                monthlyRevenue: monthlyRevenue || [],
                categorySales: categorySales || [],
                ordersByStatus: ordersByStatus || [],
                products: productsList || [],
                users: usersList || [],
                recentOrders: [],
                recentUsers: []
            }
        });

    } catch (error) {
        console.error('❌ Reports error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getSellerPerformanceReport = async (req, res) => {
    try {
        const sellers = await Seller.find({ isApproved: true });
        
        const sellerPerformance = await Promise.all(sellers.map(async (seller) => {
            const orders = await Order.find({ sellerId: seller._id });
            const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
            const totalOrders = orders.length;
            const completedOrders = orders.filter(o => o.orderStatus === 'delivered').length;
            
            return {
                sellerId: seller._id,
                sellerName: seller.name,
                shopName: seller.shopName,
                totalRevenue,
                totalOrders,
                completedOrders,
                completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
            };
        }));
        
        sellerPerformance.sort((a, b) => b.totalRevenue - a.totalRevenue);
        
        res.json({
            success: true,
            data: sellerPerformance
        });
    } catch (error) {
        console.error('Seller performance report error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== EXPORTS ====================
module.exports = {
    loginAdmin,
    registerAdmin,
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword,
    uploadAdminProfilePicture,
    getDashboardStats,
    getAllUsers,
    deleteUser,
    updateUser,
    getAllProducts,
    approveProduct,
    rejectProduct,
    updateProduct,
    deleteProduct,
    getAllSellers,
    getSellerDetails,
    approveSeller,
    deleteSeller,
    getAllOrders,
    getAdminOrderById,
    getOrdersBySeller,
    addAdminOrderNote,
    getAdminOverviewReport,
    getSellerPerformanceReport
};