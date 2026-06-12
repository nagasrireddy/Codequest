const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const {
  registerUser, verifyOtp, resendOtp, loginUser,
  getMe, logoutUser, forgotPassword, resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const {
  validate, registerRules, loginRules, emailOnlyRules, verifyOtpRules, resetPasswordRules,
} = require("../middleware/validateMiddleware");

// Throttle auth traffic to slow brute-force attempts (generous for dev)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
router.use(authLimiter);

router.post("/register", registerRules, validate, registerUser);
router.post("/verify-otp", verifyOtpRules, validate, verifyOtp);
router.post("/resend-otp", emailOnlyRules, validate, resendOtp);
router.post("/login", loginRules, validate, loginUser);
router.post("/forgot-password", emailOnlyRules, validate, forgotPassword);
router.post("/reset-password", resetPasswordRules, validate, resetPassword);

router.get("/me", protect, getMe);
router.post("/logout", protect, logoutUser);

module.exports = router;