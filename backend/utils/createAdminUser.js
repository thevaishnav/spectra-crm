const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spectra_crm';

async function createAdminUser() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    
    // Check if admin user already exists
    const existingUser = await User.findOne({ email: 'admin@spectra.com' });
    if (existingUser) {
      console.log('Admin user already exists!');
      mongoose.disconnect();
      return;
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@spectra.com',
      password: hashedPassword,
      role: 'CEO',
      phone: '1234567890',
      isActive: true
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@spectra.com');
    console.log('Password: admin123');
    console.log('Role: CEO');
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin user:', error);
    mongoose.disconnect();
  }
}

createAdminUser(); 