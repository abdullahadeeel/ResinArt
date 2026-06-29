const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
    // Check if email credentials exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('⚠️ Email credentials missing. Skipping email.');
        console.log(`📧 Would send to: ${to}`);
        console.log(`📧 Subject: ${subject}`);
        return { success: true, skipped: true };
    }

    try {
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

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}`);
        console.log('📧 Message ID:', info.messageId);
        return { success: true };
    } catch (error) {
        console.error('❌ Email send error:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = sendEmail;