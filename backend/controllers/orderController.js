const Order = require('../models/Order');
const Product = require('../models/Product');
const RawMaterial = require('../models/RawMaterial');
const ProductRecipe = require('../models/ProductRecipe');
const InventoryTransaction = require('../models/InventoryTransaction');
const { sendEmailNotification, sendWhatsAppNotification } = require('../utils/notificationService');

// ==================== HELPER: DEDUCT INVENTORY ====================
const deductInventoryForOrder = async (orderId, products, sellerId) => {
    try {
        const deductions = [];
        const failedDeductions = [];
        const lowStockAlerts = [];

        for (const item of products) {
            const product = await Product.findById(item.product);
            
            if (!product || !product.hasRecipe || !product.recipeId) {
                continue;
            }
            
            const recipe = await ProductRecipe.findById(product.recipeId);
            if (!recipe) continue;
            
            for (const materialReq of recipe.rawMaterials) {
                const material = await RawMaterial.findById(materialReq.materialId);
                
                if (!material) {
                    failedDeductions.push({
                        productName: product.name,
                        materialName: materialReq.materialName,
                        issue: 'Material not found'
                    });
                    continue;
                }
                
                const requiredQuantity = materialReq.quantity * item.quantity;
                const withWastage = requiredQuantity * (1 + (materialReq.wastageFactor || 0) / 100);
                const finalRequired = Math.ceil(withWastage);
                
                if (material.quantity < finalRequired) {
                    failedDeductions.push({
                        productName: product.name,
                        materialName: material.name,
                        required: finalRequired,
                        available: material.quantity,
                        issue: 'Insufficient stock'
                    });
                    continue;
                }
                
                const previousStock = material.quantity;
                material.quantity -= finalRequired;
                await material.save();
                
                if (material.quantity <= material.minThreshold) {
                    lowStockAlerts.push({
                        materialId: material._id,
                        materialName: material.name,
                        currentStock: material.quantity,
                        minThreshold: material.minThreshold,
                        supplierLink: material.supplierLink,
                        supplierName: material.supplierName,
                        defaultOrderQuantity: material.defaultOrderQuantity
                    });
                }
                
                deductions.push({
                    materialId: material._id,
                    materialName: material.name,
                    quantity: finalRequired,
                    unit: material.unit,
                    previousStock: previousStock,
                    newStock: material.quantity,
                    cost: finalRequired * material.costPerUnit,
                    productName: product.name
                });
            }
        }
        
        if (deductions.length > 0) {
            await InventoryTransaction.create({
                type: 'DEDUCTION',
                reason: 'ORDER_PLACED',
                orderId: orderId,
                sellerId: sellerId,
                materials: deductions,
                createdBy: sellerId,
                userRole: 'system',
                notes: `Auto deduction for order #${orderId}`
            });
        }
        
        return {
            success: failedDeductions.length === 0,
            deductions: deductions,
            failedDeductions: failedDeductions,
            lowStockAlerts: lowStockAlerts
        };
        
    } catch (error) {
        console.error('Error deducting inventory:', error);
        return { success: false, error: error.message };
    }
};

// ==================== CREATE ORDER ====================
const createOrder = async (req, res) => {
    try {
        const {
            products,
            shippingAddress,
            paymentMethod,
            totalAmount,
            subtotal,
            tax,
            shippingFee,
            notes
        } = req.body;
        
        if (!products || products.length === 0) {
            return res.status(400).json({ success: false, message: 'No products in order' });
        }
        
        const orderCount = await Order.countDocuments();
        const orderNumber = `RESIN-${String(orderCount + 1).padStart(6, '0')}`;
        
        const isCustomOrder = products[0]?.isCustom === true || 
                              String(products[0]?.product || '').startsWith('custom-');

        let mainSellerId = null;

        if (isCustomOrder) {
            const Seller = require('../models/Seller');
            const seller = await Seller.findOne({ isApproved: true });
            mainSellerId = seller ? seller._id : null;
            console.log('🎨 Custom order detected. Assigning to seller:', mainSellerId);
        } else {
            const firstProduct = await Product.findById(products[0].product);
            mainSellerId = firstProduct ? firstProduct.sellerId : null;
        }
        
        const productsWithSeller = await Promise.all(products.map(async (item) => {
            const isItemCustom = item.isCustom === true || 
                                 String(item.product || '').startsWith('custom-');
            
            if (isItemCustom) {
                return {
                    productId: null,
                    name: item.name || 'Custom Resin Art',
                    quantity: item.quantity || 1,
                    price: item.price,
                    image: item.image || '',
                    sellerId: mainSellerId,
                    sellerName: 'Komal Zahra',
                    isCustom: true,
                    customDetails: {
                        style: item.style || '',
                        productType: item.productType || '',
                        shape: item.shape || '',
                        size: item.size || '',
                        finish: item.finish || '',
                        theme: item.theme || '',
                        colorTheme: item.colorTheme || ''
                    }
                };
            } else {
                const product = await Product.findById(item.product);
                return {
                    productId: item.product,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image || product?.images?.[0] || '',
                    sellerId: product?.sellerId || null,
                    sellerName: product?.sellerName || ''
                };
            }
        }));
        
        const order = await Order.create({
            orderNumber: orderNumber,
            user: req.user._id,
            products: productsWithSeller,
            sellerId: mainSellerId,
            subtotal: subtotal || totalAmount,
            tax: tax || 0,
            shippingFee: shippingFee || 0,
            totalAmount: totalAmount,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod || 'cod',
            paymentStatus: 'pending',
            orderStatus: 'pending',
            isCustomOrder: isCustomOrder,
            notes: notes || ''
        });
        
        await order.save();
        
        if (!isCustomOrder && mainSellerId) {
            const inventoryResult = await deductInventoryForOrder(order._id, products, mainSellerId);
            if (inventoryResult && inventoryResult.deductions?.length > 0) {
                order.inventoryDeducted = true;
                order.inventoryDeductedAt = Date.now();
                await order.save();
            }
        }
        
        // ✅ FIXED: SEND ORDER CONFIRMATION EMAIL
        try {
            console.log('📧 Sending order confirmation email to:', req.user.email);
            
            const emailHtml = `
                <h2>🎨 Order Confirmed!</h2>
                <p>Hi <strong>${req.user.name}</strong>,</p>
                <p>Your order <strong>#${order.orderNumber}</strong> has been placed successfully.</p>
                <p><strong>Total Amount:</strong> Rs. ${order.totalAmount.toLocaleString()}</p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                <p>We will notify you when your order is shipped.</p>
                <br>
                <p>💖 Team ResinArt</p>
                <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-orders">View My Orders</a></p>
            `;
            
            await sendEmailNotification(
                req.user.email,
                `🎨 Order Confirmed - ${order.orderNumber}`,
                emailHtml
            );
            console.log('✅ Order confirmation email sent successfully to:', req.user.email);
        } catch (emailError) {
            console.error('❌ Email error:', emailError.message);
        }
        
        res.status(201).json({
            success: true,
            order: order
        });
        
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== GET ALL ORDERS (ADMIN - VIEW ONLY) ====================
const getOrders = async (req, res) => {
    try {
        const { status, limit = 50 } = req.query;
        
        let query = {};
        if (status && status !== 'all') {
            query.orderStatus = status;
        }
        
        const orders = await Order.find(query)
            .populate('user', 'name email')
            .populate('products.productId', 'name images')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));
        
        res.json({ success: true, count: orders.length, orders });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== GET SINGLE ORDER ====================
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('products.productId', 'name images price');
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        if (req.user.role === 'user' && order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        
        if (req.user.role === 'seller' && order.sellerId && order.sellerId.toString() !== req.user._id.toString()) {
            const sellerProducts = await Product.find({ sellerId: req.user._id });
            const productIds = sellerProducts.map(p => p._id.toString());
            const hasSellerProducts = order.products.some(item => 
                productIds.includes(item.productId?.toString())
            );
            if (!hasSellerProducts) {
                return res.status(403).json({ success: false, message: 'Unauthorized' });
            }
        }
        
        res.json({ success: true, order });
    } catch (error) {
        console.error('Get order by id error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== TRACK ORDER BY ORDER NUMBER (PUBLIC) ====================
const trackOrderByNumber = async (req, res) => {
    try {
        const { orderNumber } = req.params;
        
        const order = await Order.findOne({ orderNumber })
            .populate('user', 'name email phone');
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        res.json({
            success: true,
            order: {
                orderNumber: order.orderNumber,
                orderStatus: order.orderStatus,
                statusHistory: order.statusHistory,
                totalAmount: order.totalAmount,
                products: order.products,
                shippingAddress: order.shippingAddress,
                tcsTrackingId: order.tcsTrackingId,
                trackingUrl: order.trackingUrl,
                createdAt: order.createdAt,
                estimatedDelivery: order.deliveredAt || null
            }
        });
    } catch (error) {
        console.error('Track order error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== UPDATE ORDER STATUS ====================
const updateOrderStatus = async (req, res) => {
    try {
        const { status, note } = req.body;
        
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        const oldStatus = order.orderStatus;
        
        if (order.addStatusWithHistory) {
            order.addStatusWithHistory(status, note || `Status changed from ${oldStatus} to ${status}`, req.user.role, req.user._id);
        }
        
        await order.save();
        
        // ✅ FIXED: SEND STATUS UPDATE EMAIL
        try {
            console.log('📧 Sending status update email to:', order.user?.email || order.shippingAddress?.email);
            
            const emailHtml = `
                <h2>📦 Order Status Updated</h2>
                <p>Hi,</p>
                <p>Your order <strong>#${order.orderNumber}</strong> status has been updated.</p>
                <p><strong>New Status:</strong> ${status.toUpperCase()}</p>
                ${note ? `<p><strong>Note:</strong> ${note}</p>` : ''}
                <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/track-order/${order.orderNumber}">Track Your Order</a></p>
                <br>
                <p>💖 Team ResinArt</p>
            `;
            
            await sendEmailNotification(
                order.user?.email || order.shippingAddress?.email,
                `📦 Order Update - ${order.orderNumber}`,
                emailHtml
            );
            console.log('✅ Status update email sent successfully');
        } catch (emailError) {
            console.error('❌ Status update email error:', emailError.message);
        }
        
        res.json({
            success: true,
            order: order,
            message: `Order status updated to ${status}`
        });
        
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== ADD TCS TRACKING ID ====================
const addTcsTracking = async (req, res) => {
    try {
        const { trackingId } = req.body;
        const { id } = req.params;
        
        const order = await Order.findById(id);
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        if (req.user.role === 'seller' && order.sellerId?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        
        if (order.addTcsTracking) {
            order.addTcsTracking(trackingId, req.user.role);
        }
        if (order.addStatusWithHistory) {
            order.addStatusWithHistory('shipped', `TCS Tracking ID added: ${trackingId}`, req.user.role, req.user._id);
        }
        await order.save();
        
        // ✅ FIXED: SEND SHIPPING EMAIL
        try {
            console.log('📧 Sending shipping email to:', order.user?.email || order.shippingAddress?.email);
            
            const emailHtml = `
                <h2>🚚 Your Order has been Shipped!</h2>
                <p>Hi,</p>
                <p>Your order <strong>#${order.orderNumber}</strong> has been shipped.</p>
                <p><strong>TCS Tracking ID:</strong> ${trackingId}</p>
                <p><a href="https://www.tcsexpress.com/tracking?tracking_number=${trackingId}" target="_blank">Track on TCS Website</a></p>
                <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/track-order/${order.orderNumber}">Track Your Order</a></p>
                <br>
                <p>💖 Team ResinArt</p>
            `;
            
            await sendEmailNotification(
                order.user?.email || order.shippingAddress?.email,
                `🚚 Your Order ${order.orderNumber} has been Shipped!`,
                emailHtml
            );
            console.log('✅ Shipping email sent successfully');
        } catch (emailError) {
            console.error('❌ Shipping email error:', emailError.message);
        }
        
        res.json({
            success: true,
            message: 'TCS tracking ID added successfully',
            trackingId: trackingId,
            trackingUrl: order.trackingUrl
        });
        
    } catch (error) {
        console.error('Add TCS tracking error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== GET USER ORDERS ====================
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('products.productId', 'name images')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, count: orders.length, orders });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== GET SELLER ORDERS ====================
const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.user._id;
        console.log('🔍 Fetching orders for seller:', sellerId);
        
        const orders = await Order.find({ sellerId: sellerId })
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });
        
        console.log(`📦 Found ${orders.length} orders for seller ${sellerId}`);
        
        res.json({ success: true, count: orders.length, orders: orders });
    } catch (error) {
        console.error('❌ Get seller orders error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== CHECK INVENTORY BEFORE ORDER ====================
const checkOrderInventory = async (req, res) => {
    try {
        const { products } = req.body;
        
        if (!products || products.length === 0) {
            return res.status(400).json({ success: false, message: 'No products provided' });
        }
        
        const availabilityResults = [];
        let isFullyAvailable = true;
        
        for (const item of products) {
            const product = await Product.findById(item.product);
            
            if (!product) {
                availabilityResults.push({
                    productId: item.product,
                    productName: 'Unknown',
                    isAvailable: false,
                    message: 'Product not found'
                });
                isFullyAvailable = false;
                continue;
            }
            
            if (!product.hasRecipe || !product.recipeId) {
                availabilityResults.push({
                    productId: product._id,
                    productName: product.name,
                    isAvailable: true,
                    message: 'No inventory tracking for this product'
                });
                continue;
            }
            
            const recipe = await ProductRecipe.findById(product.recipeId);
            
            if (!recipe) {
                availabilityResults.push({
                    productId: product._id,
                    productName: product.name,
                    isAvailable: true,
                    message: 'Recipe not found'
                });
                continue;
            }
            
            const availability = await recipe.checkAvailability(item.quantity);
            availabilityResults.push({
                productId: product._id,
                productName: product.name,
                quantity: item.quantity,
                isAvailable: availability.isAvailable,
                details: availability.details
            });
            
            if (!availability.isAvailable) {
                isFullyAvailable = false;
            }
        }
        
        res.json({
            success: true,
            isFullyAvailable: isFullyAvailable,
            results: availabilityResults
        });
        
    } catch (error) {
        console.error('Check inventory error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== EXPORTS ====================
module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getUserOrders,
    getSellerOrders,
    checkOrderInventory,
    trackOrderByNumber,
    addTcsTracking
};