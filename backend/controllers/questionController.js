const Question = require("../models/Question");

// GET /api/questions   (optional ?difficulty=easy|medium|hard)
const getQuestions = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.difficulty) {
      filter.difficulty = req.query.difficulty;
    }
    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: questions.length, questions });
  } catch (error) {
    next(error);
  }
};

// GET /api/questions/:id
const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }
    res.json({ success: true, question });
  } catch (error) {
    next(error);
  }
};

module.exports = { getQuestions, getQuestionById };