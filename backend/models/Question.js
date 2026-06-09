const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    points: {
      type: Number,
      required: true,
      default: 10,
    },
    // Hidden from normal queries; only read when scoring a submission
    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required"],
      select: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);