const nodemailer = require('nodemailer');

// ==================== SEND EMAIL ====================
const sendEmailNotification = async (to, subject, html) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('⚠️ Email credentials missing. Skipping email.');
            console.log(`📧 Would send to: ${to}`);
            console.log(`📧 Subject: ${subject}`);
            return { success: true, skipped: true };
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"ResinArt by Komal Zahra" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Email send error:', error.message);
        return { success: false, error: error.message };
    }
};

// ==================== WHATSAPP ====================
const sendWhatsAppNotification = async (to, message) => {
    try {
        console.log(`📱 WhatsApp to ${to}: ${message}`);
        return { success: true };
    } catch (error) {
        console.error('❌ WhatsApp error:', error);
        return { success: false, error: error.message };
    }
};

// ==================== ORDER PLACED ====================
const sendOrderPlacedNotification = async (order, user) => {
    const subject = `🎨 Order Confirmed! - ${order.orderNumber}`;
    
    const html = `
        <h2>Thank You for Your Order! 🎉</h2>
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Your order <strong>#${order.orderNumber}</strong> has been placed successfully.</p>
        <p><strong>Total:</strong> Rs. ${order.totalAmount.toLocaleString()}</p>
        <p><strong>Payment:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
        <p>We'll notify you when your order ships.</p>
        <br>
        <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-orders">View My Orders</a></p>
        <br>
        <p>💖 Team ResinArt</p>
    `;
    
    await sendEmailNotification(user.email, subject, html);
};

// ==================== ORDER STATUS UPDATE ====================
const sendOrderStatusUpdateNotification = async (order, user, oldStatus, newStatus, note = '') => {
    const subject = `📦 Order Update - ${order.orderNumber}`;
    
    const html = `
        <h2>Order Status Updated 📦</h2>
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Your order <strong>#${order.orderNumber}</strong> status has been updated.</p>
        <p><strong>New Status:</strong> ${newStatus.toUpperCase()}</p>
        ${note ? `<p><strong>Note:</strong> ${note}</p>` : ''}
        <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/track-order/${order.orderNumber}">Track Your Order</a></p>
        <br>
        <p>💖 Team ResinArt</p>
    `;
    
    await sendEmailNotification(user.email, subject, html);
};

// ==================== SHIPPING ====================
const sendShippingNotification = async (order, user, trackingId) => {
    const subject = `🚚 Your Order ${order.orderNumber} has been Shipped!`;
    
    const html = `
        <h2>Your Order is on the Way! 🚚</h2>
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Your order <strong>#${order.orderNumber}</strong> has been shipped.</p>
        <p><strong>TCS Tracking ID:</strong> ${trackingId}</p>
        <p><a href="https://www.tcsexpress.com/tracking?tracking_number=${trackingId}" target="_blank">Track on TCS Website</a></p>
        <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/track-order/${order.orderNumber}">Track Your Order</a></p>
        <br>
        <p>💖 Team ResinArt</p>
    `;
    
    await sendEmailNotification(user.email, subject, html);
};

// ==================== WELCOME EMAIL ====================
const sendWelcomeEmail = async (user) => {
    const subject = '🎨 Welcome to ResinArt by Komal Zahra!';
    
    const html = `
        <h2>Welcome to the ResinArt Family! 🎉</h2>
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Thank you for joining ResinArt by Komal Zahra.</p>
        <p>We're so excited to have you here!</p>
        <br>
        <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/shop">Start Shopping →</a></p>
        <br>
        <p>💖 Team ResinArt</p>
    `;
    
    await sendEmailNotification(user.email, subject, html);
};

// ==================== REFUND ====================
const sendRefundNotification = async (order, user, refundAmount, refundReason) => {
    const subject = `💰 Refund Processed - ${order.orderNumber}`;
    
    const html = `
        <h2>Refund Processed 💰</h2>
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Your refund for order <strong>#${order.orderNumber}</strong> has been processed.</p>
        <p><strong>Amount:</strong> Rs. ${refundAmount.toLocaleString()}</p>
        <p><strong>Reason:</strong> ${refundReason}</p>
        <p>Please allow 5-7 business days for the refund to reflect.</p>
        <br>
        <p>💖 Team ResinArt</p>
    `;
    
    await sendEmailNotification(user.email, subject, html);
};

// ==================== EXPORTS ====================
module.exports = {
    sendEmailNotification,
    sendWhatsAppNotification,
    sendOrderPlacedNotification,
    sendOrderStatusUpdateNotification,
    sendShippingNotification,
    sendWelcomeEmail,
    sendRefundNotification
};