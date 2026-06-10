const express = require("express");
const router = express.Router();
const {
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getUsers,
  getSubmissions,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Every route below requires a logged-in admin
router.use(protect, authorize("admin"));

router.post("/questions", addQuestion);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);
router.get("/users", getUsers);
router.get("/submissions", getSubmissions);

module.exports = router;