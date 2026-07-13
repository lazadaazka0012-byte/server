const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const adminEmails = [
  'azkafajril473@gmail.com',
  'admin2@email.com'
];

async function setupAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/coffee-shop');
    console.log('✅ Connected to MongoDB');

    // Check and create admin users
    for (const email of adminEmails) {
      let user = await User.findOne({ email });
      
      if (!user) {
        console.log(`📝 Creating admin user: ${email}`);
        user = new User({
          googleId: `admin-${Date.now()}`,
          email: email,
          name: email.split('@')[0],
          picture: 'https://via.placeholder.com/150',
          role: 'admin'
        });
        await user.save();
        console.log(`✅ Admin user created: ${email}`);
      } else {
        // Update existing user to admin if needed
        if (user.role !== 'admin') {
          console.log(`🔄 Updating user role to admin: ${email}`);
          user.role = 'admin';
          await user.save();
          console.log(`✅ User role updated to admin: ${email}`);
        } else {
          console.log(`✅ Admin user already exists: ${email}`);
        }
      }
    }

    // Display all admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log('\n📋 Admin Users in Database:');
    adminUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`);
    });

    console.log('\n🎉 Admin setup completed successfully!');
    console.log('\n📱 Next Steps:');
    console.log('1. Start backend server: cd server && npm start');
    console.log('2. Start frontend server: cd client && npm run dev');
    console.log('3. Go to: http://localhost:5174/admin/login');
    console.log('4. Login with one of the admin emails above');

  } catch (error) {
    console.error('❌ Error setting up admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

setupAdmin(); 