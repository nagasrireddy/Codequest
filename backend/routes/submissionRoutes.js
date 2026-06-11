const express = require("express");
const router = express.Router();
const { submitAnswer, getMySubmissions } = require("../controllers/submissionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, submitAnswer);
router.get("/me", protect, getMySubmissions);

module.exports = router;