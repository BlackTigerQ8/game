const User = require("../models/User");
const AppError = require("../utils/appError");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { username, email, password, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User already exists with this email", 400));
    }

    // Create user
    const user = await User.create({
      username,
      email,
      phone,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Invalid email or password", 401));
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      status: "success",
      token,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout a user
// @route   GET /api/auth/logout
// @access  Public
const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
};
