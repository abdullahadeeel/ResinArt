const mongoose = require('mongoose');
require('dotenv').config();

async function update() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected');
        
        const db = mongoose.connection.db;
        
        const result = await db.collection('products').updateMany(
            { seller: { $exists: false }, sellerId: { $exists: true } },
            [{ $set: { seller: "$sellerId" } }]
        );
        
        console.log('✅ Updated:', result.modifiedCount, 'products');
        process.exit();
        
    } catch(err) {
        console.error('Error:', err);
        process.exit();
    }
}

update();