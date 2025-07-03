const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
  title: {
    type: String,
    required: [true, "Question title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Question description is required"],
    trim: true,
  },
  image: {
    type: String,
    default: null,
  },
  level: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: [true, "Question level is required"],
  },
  points: {
    type: Number,
    default: function () {
      switch (this.level) {
        case "easy":
          return 200;
        case "medium":
          return 400;
        case "hard":
          return 600;
      }
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Question", questionSchema);
