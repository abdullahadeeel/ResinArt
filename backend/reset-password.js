const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Seller = require('./models/Seller');
require('dotenv').config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        const email = 'seller@test.com';
        const newPassword = 'password123';

        // Hash password with bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        console.log('🔑 New hash:', hashedPassword);

        const result = await Seller.updateOne(
            { email: email },
            { 
                $set: { 
                    password: hashedPassword,
                    isApproved: true 
                } 
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`✅ Password reset for ${email}`);
        } else if (result.matchedCount > 0) {
            console.log(`⚠️ Account found but password not changed?`);
        } else {
            console.log(`❌ No seller found with email: ${email}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

resetPassword();