const Seller = require('../models/Seller');
const Product = require('../models/Product');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simple email logger (temporary - email actual mein baad mein implement karna)
const sendEmailNotification = async ({ to, subject, template, data }) => {
    console.log(`📧 Email would be sent to: ${to}`);
    console.log(`📧 Subject: ${subject}`);
    console.log(`📧 Data:`, data);
    return { success: true };
};

// ==================== AUTHENTICATION ====================
const registerSeller = async (req, res) => {
    try {
        const { name, email, password, shopName, phone, address } = req.body;

        if (!name || !email || !password || !shopName) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, password and shop name are required'
            });
        }

        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({
                success: false,
                message: 'Seller already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const seller = await Seller.create({
            name,
            email,
            password: hashedPassword,
            shopName,
            phone: phone || '',
            address: address || {},
            isApproved: false
        });

        const token = jwt.sign(
            { id: seller._id, role: 'seller' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            message: 'Seller registered successfully. Waiting for admin approval.',
            data: {
                _id: seller._id,
                name: seller.name,
                email: seller.email,
                shopName: seller.shopName,
                role: 'seller',
                isApproved: seller.isApproved,
                token
            }
        });
    } catch (error) {
        console.error('❌ Seller registration error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const loginSeller = async (req, res) => {
    try {
        const { email, password } = req.body;

        const seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        if (!seller.isApproved) {
            return res.status(403).json({ success: false, message: 'Your account is pending admin approval' });
        }

        const token = jwt.sign(
            { id: seller._id, role: 'seller' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                _id: seller._id,
                name: seller.name,
                email: seller.email,
                shopName: seller.shopName,
                role: 'seller',
                isApproved: seller.isApproved,
                token
            }
        });
    } catch (error) {
        console.error('❌ Seller login error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== DASHBOARD ====================
const getSellerDashboard = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const products = await Product.find({ sellerId }).sort({ createdAt: -1 });
        const orders = await Order.find({ sellerId: sellerId }).populate('user', 'name').sort({ createdAt: -1 });

        let totalRevenue = 0;
        orders.forEach(order => { totalRevenue += order.totalAmount; });

        res.json({
            success: true,
            data: {
                stats: { products: products.length, orders: orders.length, revenue: totalRevenue },
                recentOrders: orders.slice(0, 5),
                recentProducts: products.slice(0, 5),
                monthlyRevenue: []
            }
        });
    } catch (error) {
        console.error('❌ Dashboard error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== EARNINGS - UPDATED with Monthly & Product Data ====================
const getSellerEarnings = async (req, res) => {
    try {
        const sellerId = req.user._id;
        console.log('📊 Fetching earnings for seller:', sellerId);
        
        const orders = await Order.find({ sellerId: sellerId })
            .populate('products.productId', 'name')
            .sort({ createdAt: -1 });

        console.log(`📦 Total orders found: ${orders.length}`);

        let totalEarnings = 0;      // Gross amount
        let totalDeductions = 0;    // TCS charges
        let netEarnings = 0;        // Net amount after deductions
        let pendingEarnings = 0;
        let completedEarnings = 0;
        
        const monthlyMap = new Map();
        const productMap = new Map();
        
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        
        orders.forEach(order => {
            const orderAmount = order.totalAmount || 0;
            const tcsDeduction = order.tcsTotalDeduction || 0;
            const netAmount = orderAmount - tcsDeduction;
            
            totalEarnings += orderAmount;
            totalDeductions += tcsDeduction;
            netEarnings += netAmount;
            
            if (order.orderStatus === 'delivered') {
                completedEarnings += netAmount;
            } else if (order.orderStatus !== 'cancelled' && order.orderStatus !== 'refunded') {
                pendingEarnings += netAmount;
            }
            
            const orderDate = new Date(order.createdAt);
            if (orderDate >= sixMonthsAgo) {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const monthName = monthNames[orderDate.getMonth()];
                const year = orderDate.getFullYear();
                const label = `${monthName} ${year}`;
                
                if (!monthlyMap.has(label)) {
                    monthlyMap.set(label, { month: label, earnings: 0, orders: 0 });
                }
                const monthlyData = monthlyMap.get(label);
                monthlyData.earnings += netAmount;
                monthlyData.orders += 1;
            }
            
            if (order.products && order.products.length > 0) {
                order.products.forEach(product => {
                    let productName = product.name || 'Unknown Product';
                    
                    if (product.productId && product.productId.name) {
                        productName = product.productId.name;
                    }
                    
                    const productEarnings = (product.price || 0) * (product.quantity || 1);
                    const productNet = orderAmount > 0 ? (productEarnings / orderAmount) * netAmount : productEarnings;
                    
                    const productKey = product.productId ? product.productId.toString() : productName;
                    
                    if (!productMap.has(productKey)) {
                        productMap.set(productKey, { 
                            productId: product.productId,
                            productName: productName, 
                            earnings: 0,
                            quantity: 0
                        });
                    }
                    const productData = productMap.get(productKey);
                    productData.earnings += productNet;
                    productData.quantity += (product.quantity || 1);
                });
            }
        });
        
        const earningsByMonth = Array.from(monthlyMap.values())
            .sort((a, b) => {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const aMonth = a.month.split(' ')[0];
                const bMonth = b.month.split(' ')[0];
                return months.indexOf(aMonth) - months.indexOf(bMonth);
            });
        
        const earningsByProduct = Array.from(productMap.values())
            .sort((a, b) => b.earnings - a.earnings)
            .slice(0, 5);

        console.log('✅ Monthly Earnings:', JSON.stringify(earningsByMonth));
        console.log('✅ Product Earnings:', JSON.stringify(earningsByProduct));
        console.log('✅ Total Earnings:', totalEarnings);
        console.log('✅ Net Earnings:', netEarnings);
        console.log('✅ Orders Count:', orders.length);

        res.json({
            success: true,
            data: { 
                totalEarnings,
                totalDeductions,
                netEarnings,
                pendingEarnings,
                completedEarnings,
                ordersCount: orders.length,
                earningsByMonth: earningsByMonth,
                earningsByProduct: earningsByProduct
            }
        });
    } catch (error) {
        console.error('❌ Earnings error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== ORDER MANAGEMENT ====================

const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.user._id;
        console.log('🔍 Fetching orders for seller:', sellerId);
        
        const orders = await Order.find({ sellerId: sellerId })
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });
        
        console.log(`📦 Found ${orders.length} orders`);
        res.json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        console.error('❌ Get orders error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateSellerOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;
        
        console.log('📝 Updating order status:', orderId, 'to:', status);
        
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        if (order.sellerId && order.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        
        const oldStatus = order.orderStatus;
        
        order.orderStatus = status;
        
        if (!order.statusHistory) order.statusHistory = [];
        order.statusHistory.push({
            status: status,
            note: `Status changed from ${oldStatus} to ${status}`,
            timestamp: new Date(),
            updatedBy: 'seller',
            updatedById: req.user._id
        });
        
        if (status === 'delivered') order.deliveredAt = new Date();
        if (status === 'cancelled') order.cancelledAt = new Date();
        
        await order.save();
        console.log('✅ Order status updated successfully');
        
        res.json({ 
            success: true, 
            message: `Order status updated to ${status}`, 
            data: order 
        });
        
    } catch (error) {
        console.error('❌ Update order status error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const addSellerTcsTracking = async (req, res) => {
    try {
        const { trackingId, shippingCharge, codCharge } = req.body;
        const orderId = req.params.id;
        
        console.log('📝 Adding TCS tracking:', orderId, 'ID:', trackingId);
        console.log('📝 Shipping Charge:', shippingCharge, 'COD Charge:', codCharge);
        
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        if (order.sellerId && order.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        
        const shipping = parseFloat(shippingCharge) || 0;
        const cod = parseFloat(codCharge) || 0;
        const totalDeduction = shipping + cod;
        
        order.tcsTrackingId = trackingId;
        order.tcsTrackingAddedAt = new Date();
        order.tcsTrackingAddedBy = 'seller';
        
        order.tcsShippingCharge = shipping;
        order.tcsCodCharge = cod;
        order.tcsTotalDeduction = totalDeduction;
        order.isTcsChargeAdded = true;
        
        if (order.orderStatus !== 'shipped') {
            order.orderStatus = 'shipped';
            order.statusHistory.push({
                status: 'shipped',
                note: `TCS Tracking ID added: ${trackingId}. Charges: Rs.${totalDeduction} (Shipping: Rs.${shipping}, COD: Rs.${cod})`,
                timestamp: new Date(),
                updatedBy: 'seller',
                updatedById: req.user._id
            });
        }
        
        await order.save();
        console.log('✅ Tracking ID added with charges. Net earning will be: Rs.' + (order.totalAmount - totalDeduction));
        
        res.json({ 
            success: true, 
            message: `TCS tracking ID added! Total deduction: Rs.${totalDeduction}`, 
            trackingId: trackingId,
            deductions: {
                shipping: shipping,
                cod: cod,
                total: totalDeduction,
                netEarning: order.totalAmount - totalDeduction
            }
        });
    } catch (error) {
        console.error('❌ Add tracking error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const processSellerRefund = async (req, res) => {
    try {
        const { refundAmount, refundReason, refundNote } = req.body;
        const orderId = req.params.id;
        
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        if (order.sellerId && order.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        
        if (order.refundDetails?.isRefunded) {
            return res.status(400).json({ success: false, message: 'Order already refunded' });
        }
        
        if (order.orderStatus !== 'delivered') {
            return res.status(400).json({ success: false, message: 'Only delivered orders can be refunded' });
        }
        
        order.refundDetails = {
            isRefunded: true,
            refundAmount: refundAmount || order.totalAmount,
            refundReason: refundReason || 'Customer request',
            refundedAt: new Date(),
            refundedBy: req.user._id,
            refundNote: refundNote || ''
        };
        
        order.orderStatus = 'refunded';
        order.statusHistory.push({
            status: 'refunded',
            note: `Refund processed: ${refundReason}`,
            timestamp: new Date(),
            updatedBy: 'seller',
            updatedById: req.user._id
        });
        
        await order.save();
        console.log('✅ Refund processed');
        
        res.json({ success: true, message: 'Refund processed successfully' });
    } catch (error) {
        console.error('❌ Refund error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== PRODUCT MANAGEMENT ====================
const getSellerProducts = async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, count: products.length, data: products });
    } catch (error) {
        console.error('❌ Get products error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const createSellerProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, isActive } = req.body;
        
        if (!name || !price || !category) {
            return res.status(400).json({ success: false, message: 'Name, price and category are required' });
        }
        
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => `/uploads/${file.filename}`);
        }
        
        const product = await Product.create({
            name: name.trim(),
            description: description || '',
            price: Number(price),
            category: category,
            images: imageUrls,
            stock: Number(stock) || 0,
            isActive: isActive === 'true' || isActive === true,
            isApproved: false,
            sellerId: req.user._id,
            seller: req.user._id,
            sellerName: req.user.shopName || req.user.name
        });
        
        res.status(201).json({ success: true, message: 'Product created', product });
    } catch (error) {
        console.error('❌ Create product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateSellerProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, sellerId: req.user._id });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        const { name, description, price, category, stock, isActive } = req.body;
        
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: name || product.name,
                description: description !== undefined ? description : product.description,
                price: price ? Number(price) : product.price,
                category: category || product.category,
                stock: stock !== undefined ? Number(stock) : product.stock,
                isActive: isActive === 'true' || isActive === true,
                updatedAt: new Date()
            },
            { new: true }
        );
        
        res.json({ success: true, message: 'Product updated', product: updatedProduct });
    } catch (error) {
        console.error('❌ Update product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteSellerProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, sellerId: req.user._id });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        await Seller.findByIdAndUpdate(
            req.user._id,
            { $pull: { productIds: product._id } }
        );
        
        await product.deleteOne();
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        console.error('❌ Delete product error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== PROFILE ====================
// ✅ UPDATED: Complete seller profile with products, sales, and revenue
const getSellerProfile = async (req, res) => {
    try {
        const seller = await Seller.findById(req.user._id).select('-password');
        
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }
        
        
        const productsCount = await Product.countDocuments({ sellerId: req.user._id });
        
       
        const orders = await Order.find({ sellerId: req.user._id });
        
        
        let totalRevenue = 0;
        let totalSales = orders.length;
        
        orders.forEach(order => {
            totalRevenue += order.totalAmount || 0;
        });
        
        
        const products = await Product.find({ sellerId: req.user._id })
            .select('name price images')
           
        
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
                products: products || [],
                productsCount: productsCount,
                totalSales: totalSales,
                totalRevenue: totalRevenue,
                isApproved: seller.isApproved,
                createdAt: seller.createdAt,
                updatedAt: seller.updatedAt
            }
        });
    } catch (error) {
        console.error('❌ Get seller profile error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ UPDATED: Email update allowed + new token returned
const updateSellerProfile = async (req, res) => {
    try {
        const { name, email, phone, shopName, address, shopDescription } = req.body;
        
        const seller = await Seller.findById(req.user._id);
        
        if (!seller) {
            return res.status(404).json({ success: false, message: 'Seller not found' });
        }
        
        if (name) seller.name = name;
        if (email) seller.email = email;
        if (phone) seller.phone = phone;
        if (shopName) seller.shopName = shopName;
        if (address) seller.address = address;
        if (shopDescription) seller.shopDescription = shopDescription;
        
        seller.updatedAt = new Date();
        await seller.save();
        
        const token = jwt.sign(
            { id: seller._id, role: 'seller' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                _id: seller._id,
                name: seller.name,
                email: seller.email,
                phone: seller.phone,
                shopName: seller.shopName,
                role: 'seller'
            },
            token
        });
        
    } catch (error) {
        console.error('Update seller profile error:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already exists' 
            });
        }
        
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== REPORTS ====================
const getSellerSalesReport = async (req, res) => {
    try {
        const orders = await Order.find({ sellerId: req.user._id });
        const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        res.json({
            success: true,
            data: { summary: { totalOrders: orders.length, totalRevenue } }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getSellerEarningsReport = async (req, res) => {
    try {
        const orders = await Order.find({ sellerId: req.user._id, orderStatus: 'delivered' });
        let totalEarnings = 0;
        orders.forEach(order => {
            const deduction = order.tcsTotalDeduction || 0;
            totalEarnings += (order.totalAmount - deduction);
        });
        res.json({ success: true, data: { totalEarnings, totalOrders: orders.length } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== EXPORTS ====================
module.exports = {
    registerSeller,
    loginSeller,
    getSellerDashboard,
    getSellerEarnings,
    getSellerOrders,
    updateSellerOrderStatus,
    addSellerTcsTracking,
    processSellerRefund,
    getSellerSalesReport,
    getSellerEarningsReport,
    getSellerProducts,
    createSellerProduct,
    updateSellerProduct,
    deleteSellerProduct,
    getSellerProfile,
    updateSellerProfile
};