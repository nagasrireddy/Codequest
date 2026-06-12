const { body, validationResult } = require("express-validator");

// Runs after a rule set; returns 400 with field-level details if anything failed
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// --- rule sets ---
const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").trim().isEmail().withMessage("A valid email is required."),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
];

const loginRules = [
  body("email").trim().isEmail().withMessage("A valid email is required."),
  body("password").notEmpty().withMessage("Password is required."),
];

const emailOnlyRules = [
  body("email").trim().isEmail().withMessage("A valid email is required."),
];

const verifyOtpRules = [
  body("email").trim().isEmail().withMessage("A valid email is required."),
  body("otp").trim().isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits."),
];

const resetPasswordRules = [
  body("email").trim().isEmail().withMessage("A valid email is required."),
  body("otp").trim().notEmpty().withMessage("OTP is required."),
  body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
];

module.exports = {
  validate, registerRules, loginRules, emailOnlyRules, verifyOtpRules, resetPasswordRules,
};