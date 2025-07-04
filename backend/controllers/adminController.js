const Category = require("../models/Category");
const Question = require("../models/Question");
const User = require("../models/User");
const GameRoom = require("../models/GameRoom");

// @desc    Create a new category
// @route   POST /api/admin/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const category = await Category.create({
      name,
      createdBy: req.user.id,
    });

    res.status(201).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new question
// @route   POST /api/admin/questions
// @access  Private/Admin
const createQuestion = async (req, res, next) => {
  try {
    const { category, title, description, level, image } = req.body;

    const question = await Question.create({
      category,
      title,
      description,
      level,
      image: image || null,
      createdBy: req.user.id,
    });

    res.status(201).json({
      status: "success",
      data: {
        question,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
  try {
    const stats = await GameRoom.aggregate([
      {
        $group: {
          _id: null,
          totalRooms: { $sum: 1 },
          activeRooms: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
          },
          completedRooms: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalRooms: 1,
          activeRooms: 1,
          completedRooms: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats: stats[0] || {},
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  createQuestion,
  getStats,
  getUsers,
};
