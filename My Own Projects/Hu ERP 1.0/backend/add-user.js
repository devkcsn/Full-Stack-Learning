// Script to add/update a test user using the actual User model
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/haridwar_erp');
    console.log('Connected to MongoDB');
    
    const email = process.argv[2] || 'kumarchandrasheo.bcse2022@huroorkee.ac';
    const password = process.argv[3] || 'password123';
    const role = process.argv[4] || 'STUDENT';
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      // Update password using the model (will hash correctly via pre-save hook)
      user.password = password;
      await user.save();
      console.log(`Updated password for user: ${email}`);
    } else {
      // Create user using the actual model
      user = await User.create({
        email,
        password,
        role,
        isActive: true,
        emailVerified: true
      });
      console.log(`Created user: ${email} with role: ${role}`);
    }
    
    // List all users
    const users = await User.find({}, { email: 1, role: 1 });
    console.log('\nAll users:');
    users.forEach(u => console.log(`  - ${u.email} (${u.role})`));
    
    console.log(`\nYou can now login with:`);
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
