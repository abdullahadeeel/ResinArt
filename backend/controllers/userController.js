// backend/controllers/userController.js
const User = require('../models/user');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Seller = require('../models/Seller'); // ✅ ADD THIS
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOrderConfirmation } = require('../utils/emailService');
const { persistImageSource } = require('../utils/persistImage'); // ✅ ADDED FROM CODE 1

// Helper function to generate order number manually
const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;
};

// @desc    Register User
// @route   POST /api/users/register
const registerUser = async (req, res) => {
    try {
        console.log('📝 Register attempt:', req.body.email);
        
        const { name, email, password, phone } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone: phone || ''
        });

        const token = jwt.sign(
            { id: user._id, role: 'user' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );

        console.log('✅ User registered:', user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }
        });
    } catch (error) {
        console.error('❌ User registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Login User
// @route   POST /api/users/login
const loginUser = async (req, res) => {
    try {
        console.log('🔐 Login attempt:', req.body.email);
        
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            { id: user._id, role: 'user' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: 'user',
                token
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get User Profile
// @route   GET /api/users/profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update User Profile
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;
        
        const updatedUser = await user.save();
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get User Orders
// @route   GET /api/users/orders
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('❌ Get orders error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create Order
// @route   POST /api/users/orders
// ✅ FIXED: sellerId ab properly save hoga — seller panel mein orders aayenge
const createOrder = async (req, res) => {
    try {
        console.log('📦 Creating order for user:', req.user._id);
        console.log('📦 Order data:', JSON.stringify(req.body, null, 2));
        
        const { products, totalAmount, paymentMethod, shippingAddress, subtotal, tax, shippingFee } = req.body;
        
        if (!products || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }
        
        const formattedProducts = [];
        let mainSellerId = null; // ✅ track karega seller ID

        for (const item of products) {
            const rawProductId = item.productId || item.product;
            console.log('🔍 Processing product item:', JSON.stringify({ rawProductId, name: item.name, isCustom: item.isCustom }));

            // ✅ Custom product check
            const isCustomProduct = !rawProductId ||
                item.isCustom === true ||
                (rawProductId && rawProductId.toString().startsWith('custom-'));

            if (isCustomProduct) {
                // ✅ Custom order — approved seller ko assign karo
                if (!mainSellerId) {
                    const seller = await Seller.findOne({ isApproved: true });
                    mainSellerId = seller ? seller._id : null;
                    console.log('🎨 Custom order — sellerId assigned:', mainSellerId);
                }

                const finalProductId = item.productId || `custom-${Date.now()}`;
                console.log('🎨 Custom product productId:', finalProductId);

                formattedProducts.push({
                    productId: finalProductId,
                    name: item.name || 'Custom Resin Art',
                    image: item.image || '',
                    quantity: item.quantity || 1,
                    price: item.price,
                    isCustom: true,
                    sellerId: mainSellerId,
                    sellerName: 'Komal Zahra'
                });

            } else {
                // ✅ Normal product — DB se sellerId nikalo
                let productInfo = {
                    name: item.name,
                    price: item.price,
                    image: item.image || '',
                    sellerId: null,
                    sellerName: 'ResinArt'
                };

                if (rawProductId && rawProductId.toString().match(/^[0-9a-fA-F]{24}$/)) {
                    try {
                        const product = await Product.findById(rawProductId);
                        if (product) {
                            productInfo.sellerId = product.sellerId || null;
                            productInfo.sellerName = product.sellerName || 'ResinArt';
                            productInfo.image = product.images?.[0] || item.image || '';
                            console.log('🛍️ Product found — sellerId:', productInfo.sellerId);
                        } else {
                            console.error('❌ Product not found in DB:', rawProductId);
                        }
                    } catch (err) {
                        console.log('Product fetch error (using provided data):', err.message);
                    }
                }

                // ✅ pehle normal product ka sellerId mainSellerId mein set karo
                if (!mainSellerId && productInfo.sellerId) {
                    mainSellerId = productInfo.sellerId;
                }

                formattedProducts.push({
                    productId: rawProductId,
                    name: productInfo.name,
                    // ✅ ADDED persistImageSource from code 1
                    image: productInfo.image ? await persistImageSource(productInfo.image) : '',
                    quantity: item.quantity,
                    price: item.price,
                    isCustom: false,
                    sellerId: productInfo.sellerId,
                    sellerName: productInfo.sellerName
                });
            }
        }
        
        if (formattedProducts.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid products to order'
            });
        }

        console.log('✅ mainSellerId to be saved:', mainSellerId);
        
        const calculatedSubtotal = subtotal || formattedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const calculatedTax = tax || 0;
        const calculatedShippingFee = shippingFee || (calculatedSubtotal > 5000 ? 0 : 200);
        const calculatedTotal = totalAmount || (calculatedSubtotal + calculatedTax + calculatedShippingFee);
        
        const orderNumber = generateOrderNumber();
        
        const formattedAddress = {
            fullName: shippingAddress?.fullName || shippingAddress?.name || '',
            street: shippingAddress?.street || shippingAddress?.address || '',
            city: shippingAddress?.city || '',
            state: shippingAddress?.state || '',
            zipCode: shippingAddress?.zipCode || shippingAddress?.postalCode || '',
            country: shippingAddress?.country || 'Pakistan',
            phone: shippingAddress?.phone || '',
            email: shippingAddress?.email || req.user?.email || ''
        };
        
        const order = await Order.create({
            orderNumber: orderNumber,
            user: req.user._id,
            products: formattedProducts,
            sellerId: mainSellerId,          // ✅ YEH FIX HAI — ab seller panel mein aayega
            subtotal: calculatedSubtotal,
            tax: calculatedTax,
            shippingFee: calculatedShippingFee,
            totalAmount: calculatedTotal,
            paymentMethod: paymentMethod || 'cod',
            paymentStatus: 'pending',
            orderStatus: 'pending',
            shippingAddress: formattedAddress
        });
        
        console.log('✅ Order created successfully:', order._id);
        console.log('✅ Order Number:', order.orderNumber);
        console.log('✅ sellerId saved:', order.sellerId);
        
        try {
            const user = await User.findById(req.user._id);
            await sendOrderConfirmation(order, user);
            console.log('✅ Confirmation email sent to:', user.email);
        } catch (emailError) {
            console.error('❌ Email sending failed:', emailError.message);
        }
        
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
        
    } catch (error) {
        console.error('❌ Order creation error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            error: error.stack
        });
    }
};

// @desc    Get Single Order Details
// @route   GET /api/users/orders/:id
const getOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user._id;
        
        console.log('🔍 Fetching order details...');
        console.log('📦 Order ID:', orderId);
        console.log('👤 User ID:', userId);
        
        const orderExists = await Order.findById(orderId);
        
        if (!orderExists) {
            console.log('❌ Order not found in database');
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        if (orderExists.user.toString() !== userId.toString()) {
            console.log('❌ Authorization failed - User mismatch');
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to view this order'
            });
        }
        
        console.log('✅ Authorization successful, returning order');
        
        res.json({
            success: true,
            data: orderExists
        });
        
    } catch (error) {
        console.error('❌ Get order details error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getUserOrders,
    getOrderDetails,
    createOrder
};