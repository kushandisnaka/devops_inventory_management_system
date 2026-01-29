const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = 'mongodb+srv://admin:OTxmqRs2ztxQsOvs@cluster0.04mnwwa.mongodb.net/inventory_db';

mongoose.connect(MONGO_URI)
.then(() => console.log('✓ MongoDB connected successfully'))
.catch(err => console.error('✗ MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

// Sign Up Endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password, // Note: In production, hash the password using bcrypt
    });

    await newUser.save();
    res.status(201).json({ 
      message: 'Account created successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check password (In production, use bcrypt to compare)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({ 
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Backend is running' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});