const GameRoom = require("../models/GameRoom");
const {
  selectQuestions,
  checkQuestionInventory,
} = require("./questionService");
const UserQuestionHistory = require("../models/UserQuestionHistory");
const AppError = require("../utils/appError");

/**
 * Creates a new game room
 */
exports.createRoom = async (userId, roomName) => {
  return await GameRoom.create({
    name: roomName,
    creator: userId,
  });
};

/**
 * Adds teams to a game room
 */
exports.addTeams = async (roomId, teams) => {
  const room = await GameRoom.findById(roomId);
  if (!room) throw new AppError("Room not found", 404);

  room.teams = teams.map((name) => ({ name }));
  await room.save();

  return room;
};

/**
 * Selects categories for the game
 */
exports.selectCategories = async (userId, roomId, categoryIds) => {
  const room = await GameRoom.findById(roomId);
  if (!room) throw new AppError("Room not found", 404);

  // Validate team-category ratio (2 categories per team)
  const requiredCategories = room.teams.length * 2;
  if (categoryIds.length !== requiredCategories) {
    throw new AppError(
      `Exactly ${requiredCategories} categories required for ${room.teams.length} teams`,
      400
    );
  }

  // Check question inventory
  await checkQuestionInventory(userId, requiredCategories);

  room.categories = categoryIds;
  await room.save();

  return room;
};

/**
 * Starts the game by generating questions
 */
exports.startGame = async (userId, roomId) => {
  const room = await GameRoom.findById(roomId).populate("categories");
  if (!room) throw new AppError("Room not found", 404);

  // Check if user is room creator
  if (room.creator.toString() !== userId.toString()) {
    throw new AppError("Only room creator can start game", 403);
  }

  // Generate questions
  const questions = await selectQuestions(userId, room.categories);

  // Map questions to room format
  room.questions = questions.map((q) => ({
    question: q._id,
    points: q.points,
  }));

  room.status = "active";
  await room.save();

  return room;
};

/**
 * Records a question as seen by user
 */
exports.recordSeenQuestion = async (userId, questionId, roomId) => {
  await UserQuestionHistory.create({
    userId,
    questionId,
    roomId,
  });
};

/**
 * Awards points to a team
 */
exports.awardPoints = async (roomId, questionIndex, teamIndex) => {
  const room = await GameRoom.findById(roomId);
  if (!room) throw new AppError("Room not found", 404);

  // Validate indices
  if (questionIndex < 0 || questionIndex >= room.questions.length) {
    throw new AppError("Invalid question index", 400);
  }

  if (teamIndex < 0 || teamIndex >= room.teams.length) {
    throw new AppError("Invalid team index", 400);
  }

  const question = room.questions[questionIndex];

  // Mark as answered and award points
  question.answered = true;
  question.awardedTo = teamIndex;
  room.teams[teamIndex].score += question.points;

  await room.save();
  return room;
};
