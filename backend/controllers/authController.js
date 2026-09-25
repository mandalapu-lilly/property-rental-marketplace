import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Helper to generate JWT token
const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'fallback_development_secret_key_change_in_production';
  return jwt.sign({ id, role }, secret, {
    expiresIn: '7d',
  });
};

// Email validation regex
const isValidEmail = (email) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

// Strong password validation: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const isStrongPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
  return true;
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Please provide all required fields: name, email, and password',
      });
    }

    // 2. Validate email format
    const trimmedEmail = email.trim().toLowerCase();
    if (!isValidEmail(trimmedEmail)) {
      return res.status(400).json({
        error: 'Please provide a valid email address',
      });
    }

    // 3. Validate strong password requirements
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).',
      });
    }

    // 4. Validate role if provided
    const validRoles = ['user', 'host', 'admin'];
    const userRole = role && validRoles.includes(role) ? role : 'user';

    // 5. Check if user already exists
    const userExists = await User.findOne({ email: trimmedEmail });
    if (userExists) {
      return res.status(409).json({
        error: 'User with this email already exists',
      });
    }

    // 6. Create user (password is automatically hashed via Mongoose pre-save hook)
    const user = await User.create({
      name: name.trim(),
      email: trimmedEmail,
      password,
      role: userRole,
    });

    // 7. Return success response (toJSON strips password)
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        error: 'Please provide both email and password',
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 2. Check user exists
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // 3. Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // 4. Generate JWT
    const token = generateToken(user._id, user.role);

    // 5. Return token & sanitized user info
    return res.status(200).json({
      message: 'Login successful',
      token,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    return res.status(200).json({
      user: {
        id: req.user._id,
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile name
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name.trim();
    await user.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change user password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        error: 'Please provide current password, new password, and confirm password',
      });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        error: 'New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: 'New password and confirm password do not match',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot Password - request password reset token / code
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Please provide an email address' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      return res.status(404).json({ error: 'No account with that email address exists' });
    }

    // Generate random 32-byte hex reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and store in database with 30-minute expiry
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: 'Password reset instructions generated successfully.',
      resetToken,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset Password using reset token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword, confirmPassword, email } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Please provide both new password and confirm password' });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        error: 'New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirm password do not match' });
    }

    let user;

    if (token) {
      const hashedToken = crypto.createHash('sha256').update(token.trim()).digest('hex');
      user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
    }

    // Fallback: If email provided and reset is within valid window
    if (!user && email) {
      const trimmedEmail = email.trim().toLowerCase();
      user = await User.findOne({
        email: trimmedEmail,
        resetPasswordExpire: { $gt: Date.now() },
      });
    }

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired password reset token. Please request a new link.' });
    }

    // Update password (hashed automatically via pre-save hook)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Your password has been reset successfully. You can now sign in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};
