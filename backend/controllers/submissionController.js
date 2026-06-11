const Question = require("../models/Question");
const Submission = require("../models/Submission");
const Leaderboard = require("../models/Leaderboard");

// POST /api/submissions
const submitAnswer = async (req, res, next) => {
  try {
    const { questionId, answer } = req.body;
    if (!questionId || !answer) {
      return res.status(400).json({ success: false, message: "questionId and answer are required." });
    }

    // userId comes from the token, never from the request body (IDOR guard)
    const userId = req.user._id;

    // We need the correct answer, which is hidden by default
    const question = await Question.findById(questionId).select("+correctAnswer");
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }

    // One attempt per question — keeps the leaderboard honest
    const existing = await Submission.findOne({ userId, questionId });
    if (existing) {
      return res.status(400).json({ success: false, message: "You have already attempted this question." });
    }

    // Score by exact match (case-insensitive, trimmed)
    const isCorrect =
      answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    const score = isCorrect ? question.points : 0;

    const submission = await Submission.create({ userId, questionId, answer, score });

    // Add the earned points to the user's leaderboard total (create the row if needed)
    await Leaderboard.findOneAndUpdate(
      { userId },
      { $inc: { totalScore: score } },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: isCorrect ? "Correct answer!" : "Incorrect answer.",
      result: {
        correct: isCorrect,
        scoreEarned: score,
        submissionId: submission._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/submissions/me
const getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ userId: req.user._id })
      .populate("questionId", "title difficulty points")
      .sort({ createdAt: -1 });

    const totalScore = submissions.reduce((sum, s) => sum + s.score, 0);

    res.json({ success: true, count: submissions.length, totalScore, submissions });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitAnswer, getMySubmissions };