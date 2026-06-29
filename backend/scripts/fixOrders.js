const mongoose = require('mongoose');
require('dotenv').config();

async function fixOrders() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected');
    
    // Get Komal's seller ID from products
    const product = await mongoose.connection.db.collection('products').findOne({ sellerId: { $exists: true } });
    const sellerId = product?.sellerId;
    
    if (!sellerId) {
        console.log('No seller found in products');
        return;
    }
    
    console.log('Using seller ID:', sellerId);
    
    // Update orders without sellerId
    const result = await mongoose.connection.db.collection('orders').updateMany(
        { sellerId: { $exists: false } },
        { $set: { sellerId: sellerId } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} orders`);
    process.exit();
}

fixOrders();