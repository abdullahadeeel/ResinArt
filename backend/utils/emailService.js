const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send Order Confirmation Email
const sendOrderConfirmation = async (order, user) => {
    // Check if email credentials exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('⚠️ Email credentials not configured. Skipping order confirmation.');
        console.log(`📧 Would send to: ${user.email}`);
        return { success: true, skipped: true };
    }

    const mailOptions = {
        from: `"ResinArt by Komal Zahra" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Order Confirmed! - ${order.orderNumber}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #fffaf5; color: #2d1f12; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; padding: 30px; border: 1px solid #f0e4d8; }
                    .header { text-align: center; border-bottom: 2px solid #f0e4d8; padding-bottom: 20px; margin-bottom: 20px; }
                    .logo { font-size: 28px; color: #9a3412; font-family: Georgia, serif; }
                    .order-details { background: #fef7f0; padding: 20px; border-radius: 16px; margin: 20px 0; }
                    .order-number { font-size: 20px; font-weight: bold; color: #9a3412; }
                    .product-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0e4d8; }
                    .total { font-size: 18px; font-weight: bold; color: #9a3412; text-align: right; margin-top: 15px; }
                    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0e4d8; font-size: 12px; color: #8b6b58; }
                    .button { background-color: #9a3412; color: white; padding: 12px 24px; text-decoration: none; border-radius: 40px; display: inline-block; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">✨ ResinArt by Komal Zahra</div>
                        <p>From Our Hearts to Your Home</p>
                    </div>
                    
                    <h2>Thank You for Your Order! 🎉</h2>
                    <p>Hi <strong>${user.name}</strong>,</p>
                    <p>Your order has been received and is now being processed.</p>
                    
                    <div class="order-details">
                        <p class="order-number">Order #${order.orderNumber}</p>
                        <p>Placed on: ${new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}</p>
                        
                        <h3>Order Items:</h3>
                        ${order.products.map(item => `
                            <div class="product-item">
                                <span>${item.name} x ${item.quantity}</span>
                                <span>Rs. ${(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        `).join('')}
                        
                        <div class="total">
                            Total: Rs. ${order.totalAmount.toLocaleString()}
                        </div>
                    </div>
                    
                    <p>We'll notify you when your order ships. You can track your order status in your account.</p>
                    
                    <div style="text-align: center;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-orders" class="button">Track Your Order</a>
                    </div>
                    
                    <div class="footer">
                        <p>© 2024 ResinArt by Komal Zahra. All rights reserved.</p>
                        <p>Handcrafted resin art preserving memories and bringing beauty to your home.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Order confirmation email sent to ${user.email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Email send error:', error);
        return { success: false, error: error.message };
    }
};

// Send Order Status Update Email
const sendOrderStatusUpdate = async (order, user, oldStatus, newStatus) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('⚠️ Email credentials missing. Skipping status update email.');
        return { success: true, skipped: true };
    }

    const statusMessages = {
        'processing': 'Your order is being processed and prepared for shipment.',
        'shipped': 'Great news! Your order has been shipped and is on its way to you.',
        'delivered': 'Your order has been delivered. We hope you love your ResinArt piece!',
        'cancelled': 'Your order has been cancelled. If you have any questions, please contact us.'
    };
    
    const mailOptions = {
        from: `"ResinArt by Komal Zahra" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Order Status Update - ${order.orderNumber}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #fffaf5; color: #2d1f12; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; padding: 30px; border: 1px solid #f0e4d8; }
                    .header { text-align: center; border-bottom: 2px solid #f0e4d8; padding-bottom: 20px; margin-bottom: 20px; }
                    .logo { font-size: 28px; color: #9a3412; font-family: Georgia, serif; }
                    .status { background: #fef7f0; padding: 20px; border-radius: 16px; margin: 20px 0; text-align: center; }
                    .status-badge { display: inline-block; padding: 8px 20px; border-radius: 40px; font-weight: bold; margin-top: 10px; }
                    .status-shipped { background-color: #d1fae5; color: #059669; }
                    .status-delivered { background-color: #dcfce7; color: #16a34a; }
                    .status-processing { background-color: #fef3c7; color: #d97706; }
                    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0e4d8; font-size: 12px; color: #8b6b58; }
                    .button { background-color: #9a3412; color: white; padding: 12px 24px; text-decoration: none; border-radius: 40px; display: inline-block; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">✨ ResinArt by Komal Zahra</div>
                    </div>
                    
                    <h2>Order Status Updated! 📦</h2>
                    <p>Hi <strong>${user.name}</strong>,</p>
                    <p>Your order status has been updated.</p>
                    
                    <div class="status">
                        <p>Order #${order.orderNumber}</p>
                        <div class="status-badge status-${newStatus}">
                            ${newStatus.toUpperCase()}
                        </div>
                        <p style="margin-top: 15px;">${statusMessages[newStatus] || `Your order is now ${newStatus}.`}</p>
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-orders" class="button">Track Your Order</a>
                    </div>
                    
                    <div class="footer">
                        <p>© 2024 ResinArt by Komal Zahra. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Status update email sent to ${user.email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Email send error:', error);
        return { success: false, error: error.message };
    }
};

// Send Welcome Email
const sendWelcomeEmail = async (user) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('⚠️ Email credentials missing. Skipping welcome email.');
        return { success: true, skipped: true };
    }

    const mailOptions = {
        from: `"ResinArt by Komal Zahra" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: '🎨 Welcome to ResinArt by Komal Zahra!',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #fffaf5; color: #2d1f12; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; padding: 30px; border: 1px solid #f0e4d8; }
                    .header { text-align: center; border-bottom: 2px solid #f0e4d8; padding-bottom: 20px; }
                    .logo { font-size: 28px; color: #9a3412; font-family: Georgia, serif; }
                    .button { background-color: #9a3412; color: white; padding: 12px 24px; text-decoration: none; border-radius: 40px; display: inline-block; margin-top: 20px; }
                    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0e4d8; font-size: 12px; color: #8b6b58; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">✨ ResinArt by Komal Zahra</div>
                        <p>From Our Hearts to Your Home</p>
                    </div>
                    
                    <h2>Welcome to the ResinArt Family! 🎉</h2>
                    <p>Hi <strong>${user.name}</strong>,</p>
                    <p>Thank you for joining ResinArt by Komal Zahra.</p>
                    <p>We're so excited to have you here! As a valued member, you'll be the first to know about:</p>
                    <ul>
                        <li>✨ New collection launches</li>
                        <li>🎨 Behind-the-scenes content</li>
                        <li>💝 Special offers and discounts</li>
                        <li>🌸 Art tips and inspiration</li>
                    </ul>
                    
                    <div style="text-align: center;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/shop" class="button">Start Shopping →</a>
                    </div>
                    
                    <div class="footer">
                        <p>© 2024 ResinArt by Komal Zahra. All rights reserved.</p>
                        <p>Handcrafted resin art preserving memories and bringing beauty to your home. 💖</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${user.email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Welcome email error:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendOrderConfirmation, sendOrderStatusUpdate, sendWelcomeEmail };