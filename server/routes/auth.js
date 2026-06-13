import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';

// Register a new user
router.post('/signup', async (req, res) => {
  try {
    let { email, password, displayName } = req.body;
    if (email) email = email.toLowerCase();

    // Validation
    if (!email || !password || !displayName) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      displayName,
    });
    await newUser.save();

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Respond with user and token
    res.status(201).json({
      token,
      user: {
        uid: newUser._id.toString(),
        email: newUser.email,
        displayName: newUser.displayName,
        photoURL: null,
        isLocalOnly: false
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login an existing user
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    if (email) email = email.toLowerCase();

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Respond with user and token
    res.json({
      token,
      user: {
        uid: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
        photoURL: null,
        isLocalOnly: false
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
