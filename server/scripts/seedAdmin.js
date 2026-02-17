import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-notice-board');
  const exists = await User.findOne({ email: 'admin@college.edu' });
  if (exists) {
    console.log('Admin already exists.');
    process.exit(0);
  }
  await User.create({
    name: 'Admin',
    email: 'admin@college.edu',
    password: 'admin123',
    role: 'admin'
  });
  console.log('Admin created: admin@college.edu / admin123');
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
