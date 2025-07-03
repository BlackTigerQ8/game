const mongoose = require("mongoose");

const gameRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Room name is required"],
      trim: true,
      maxlength: [50, "Room name cannot exceed 50 characters"],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teams: [
      {
        name: {
          type: String,
          required: [true, "Team name is required"],
          trim: true,
          maxlength: [30, "Team name cannot exceed 30 characters"],
        },
        score: {
          type: Number,
          default: 0,
        },
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    questions: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        points: {
          type: Number,
          required: true,
        },
        answered: {
          type: Boolean,
          default: false,
        },
        awardedTo: {
          type: Number,
          default: -1,
        },
      },
    ],
    currentQuestionIndex: {
      type: Number,
      default: -1,
    },
    status: {
      type: String,
      enum: ["setup", "active", "completed"],
      default: "setup",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add index for faster querying
gameRoomSchema.index({ creator: 1, status: 1 });

module.exports = mongoose.model("GameRoom", gameRoomSchema);
