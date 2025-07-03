const Category = require("../models/Category");
const Question = require("../models/Question");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");

exports.createCategory = asyncHandler(async (req, res, next) => {
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
});

exports.createQuestion = asyncHandler(async (req, res, next) => {
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
});

exports.getStats = asyncHandler(async (req, res, next) => {
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
});
