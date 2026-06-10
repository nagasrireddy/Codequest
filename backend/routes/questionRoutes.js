const express = require("express");
const router = express.Router();
const { getQuestions, getQuestionById } = require("../controllers/questionController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getQuestions);
router.get("/:id", protect, getQuestionById);

module.exports = router;