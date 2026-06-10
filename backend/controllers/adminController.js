const Question = require("../models/Question");
const User = require("../models/User");
const Submission = require("../models/Submission");

// POST /api/admin/questions
const addQuestion = async (req, res, next) => {
  try {
    const { title, description, difficulty, points, correctAnswer } = req.body;
    if (!title || !description || !correctAnswer) {
      return res.status(400).json({
        success: false,
        message: "Title, description and correctAnswer are required.",
      });
    }

    const question = await Question.create({ title, description, difficulty, points, correctAnswer });
    res.status(201).json({ success: true, message: "Question created.", question });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/questions/:id
const updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }
    res.json({ success: true, message: "Question updated.", question });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/questions/:id
const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }
    res.json({ success: true, message: "Question deleted." });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/submissions
const getSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find()
      .populate("userId", "name email")
      .populate("questionId", "title")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    next(error);
  }
};

module.exports = { addQuestion, updateQuestion, deleteQuestion, getUsers, getSubmissions };