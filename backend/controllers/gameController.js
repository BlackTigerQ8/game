const gameService = require("../services/gameService");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");

// Create new game room
exports.createRoom = asyncHandler(async (req, res) => {
  const room = await gameService.createRoom(req.user.id, req.body.name);
  res.status(201).json(room);
});

// Add teams to room
exports.addTeams = asyncHandler(async (req, res) => {
  const room = await gameService.addTeams(req.params.id, req.body.teams);
  res.json(room);
});

// Select categories
exports.selectCategories = asyncHandler(async (req, res) => {
  const room = await gameService.selectCategories(
    req.user.id,
    req.params.id,
    req.body.categories
  );
  res.json(room);
});

// Start game
exports.startGame = asyncHandler(async (req, res) => {
  const room = await gameService.startGame(req.user.id, req.params.id);
  res.json(room);
});

// Reveal question
exports.revealQuestion = asyncHandler(async (req, res) => {
  const { roomId, questionIndex } = req.params;

  // Record question as seen
  const room = await GameRoom.findById(roomId);
  await gameService.recordSeenQuestion(
    req.user.id,
    room.questions[questionIndex].question,
    roomId
  );

  // Set current question
  room.currentQuestionIndex = questionIndex;
  await room.save();

  res.json(room);
});

// Award points
exports.awardPoints = asyncHandler(async (req, res) => {
  const room = await gameService.awardPoints(
    req.params.id,
    req.body.questionIndex,
    req.body.teamIndex
  );
  res.json(room);
});

// Get room state
exports.getRoom = asyncHandler(async (req, res) => {
  const room = await GameRoom.findById(req.params.id)
    .populate("categories")
    .populate("questions.question");

  if (!room) throw new AppError("Room not found", 404);

  // Authorization check
  if (room.creator.toString() !== req.user.id) {
    throw new AppError("Not authorized to access this room", 403);
  }

  res.json(room);
});
