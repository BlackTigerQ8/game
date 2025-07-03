const Question = require("../models/Question");
const UserQuestionHistory = require("../models/UserQuestionHistory");
const AppError = require("../utils/appError");

/**
 * Selects questions for a user from given categories
 */
exports.selectQuestions = async (userId, categoryIds) => {
  // Get user's seen questions
  const seenQuestions = await UserQuestionHistory.find({ userId }).distinct(
    "questionId"
  );

  // Aggregate pipeline to select questions
  const questions = await Question.aggregate([
    {
      $match: {
        category: { $in: categoryIds },
        _id: { $nin: seenQuestions },
      },
    },
    {
      $group: {
        _id: { category: "$category", level: "$level" },
        questions: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        sampled: { $slice: ["$questions", 2] },
      },
    },
    { $unwind: "$sampled" },
    { $replaceRoot: { newRoot: "$sampled" } },
  ]);

  return questions;
};

/**
 * Checks if there are enough unseen questions
 */
exports.checkQuestionInventory = async (userId, requiredCategories) => {
  // Get user's seen questions
  const seenQuestions = await UserQuestionHistory.find({ userId }).distinct(
    "questionId"
  );

  const result = await Question.aggregate([
    {
      $match: { _id: { $nin: seenQuestions } },
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $match: { count: { $gte: 6 } },
    },
    {
      $count: "totalCategories",
    },
  ]);

  const availableCategories = result[0]?.totalCategories || 0;

  if (availableCategories < requiredCategories) {
    throw new AppError(
      "All questions completed! Email admin@trivia.com to request more",
      400
    );
  }

  return availableCategories >= requiredCategories;
};
