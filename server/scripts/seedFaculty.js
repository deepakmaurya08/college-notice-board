import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const seedFaculty = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-notice-board');
  const exists = await User.findOne({ email: 'faculty@college.edu' });
  if (exists) {
    console.log('Faculty user already exists.');
    process.exit(0);
  }
  await User.create({
    name: 'Faculty',
    email: 'faculty@college.edu',
    password: 'faculty123',
    role: 'faculty'
  });
  console.log('Faculty created: faculty@college.edu / faculty123');
  process.exit(0);
};

seedFaculty().catch((err) => {
  console.error(err);
  process.exit(1);
});
