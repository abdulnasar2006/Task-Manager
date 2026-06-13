import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/tasks.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

import bcrypt from 'bcryptjs';
import User from './models/User.js';

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://abdulnasar2301_db_user:oqpnzqijv0zHZo6Q@cluster0.w4st3bd.mongodb.net/?appName=Cluster0')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Auto-seed test user
    try {
      const testEmail = 'test@smarttasks.com';
      const existingTestUser = await User.findOne({ email: testEmail });
      if (!existingTestUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        await User.create({
          email: testEmail,
          password: hashedPassword,
          displayName: 'Test User'
        });
        console.log('Test user seeded automatically.');
      }
    } catch (err) {
      console.error('Failed to seed test user:', err);
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
