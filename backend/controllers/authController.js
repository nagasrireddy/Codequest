const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Otp = require("../models/Otp");
const generateOTP = require("../utils/generateOTP");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

// --- helpers -------------------------------------------------------------

// Create a fresh OTP for an email, store its hash, and send it out
const issueOtp = async (email, subject) => {
  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, 10);
  const minutes = Number(process.env.OTP_EXPIRY_MINUTES) || 10;
  const expiresAt = new Date(Date.now() + minutes * 60 * 1000);

  await Otp.deleteMany({ email });
  await Otp.create({ email, otpHash, expiresAt });

  await sendEmail({
    to: email,
    subject,
    text: `Your CodeQuest code is ${otp}. It expires in ${minutes} minutes.`,
  });
};

// Validate the latest OTP for an email. Returns { ok, status?, message? }
const checkOtp = async (email, otp) => {
  const record = await Otp.findOne({ email }).sort({ createdAt: -1 });

  if (!record) {
    return { ok: false, status: 400, message: "OTP not found. Please request a new one." };
  }
  if (record.expiresAt.getTime() < Date.now()) {
    await Otp.deleteMany({ email });
    return { ok: false, status: 400, message: "OTP has expired. Please request a new one." };
  }
  if (record.attempts >= 5) {
    await Otp.deleteMany({ email });
    return { ok: false, status: 429, message: "Too many attempts. Please request a new OTP." };
  }

  const isMatch = await bcrypt.compare(otp, record.otpHash);
  if (!isMatch) {
    record.attempts += 1;
    await record.save();
    return { ok: false, status: 400, message: "Invalid OTP." };
  }

  return { ok: true };
};

// --- controllers ---------------------------------------------------------

// POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required." });
    }

    let user = await User.findOne({ email });
    if (user && user.verified) {
      return res.status(400).json({ success: false, message: "Email is already registered." });
    }

    if (!user) {
      user = await User.create({ name, email, password });
    } else {
      // Unverified account already exists — refresh its details
      user.name = name;
      user.password = password;
      await user.save();
    }

    await issueOtp(email, "Your CodeQuest verification code");

    res.status(201).json({
      success: true,
      message: "OTP sent to your email. Verify it to complete registration.",
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/verify-otp
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required." });
    }

    const result = await checkOtp(email, otp);
    if (!result.ok) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    const user = await User.findOneAndUpdate({ email }, { verified: true }, { new: true });
    await Otp.deleteMany({ email });

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: "Email verified successfully.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/resend-otp
const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found for this email." });
    }
    if (user.verified) {
      return res.status(400).json({ success: false, message: "This account is already verified." });
    }

    await issueOtp(email, "Your CodeQuest verification code");
    res.json({ success: true, message: "A new OTP has been sent to your email." });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }
    if (!user.verified) {
      return res.status(403).json({ success: false, message: "Please verify your email before logging in." });
    }
    
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me  (protected)
const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        verified: req.user.verified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout  (protected)
const logoutUser = async (req, res, next) => {
  try {
    // JWT is stateless — the client just discards the token
    res.json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (user) {
      await issueOtp(email, "Reset your CodeQuest password");
    }

    // Generic response so we don't reveal whether an email is registered
    res.json({
      success: true,
      message: "If an account exists for that email, a reset code has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "Email, OTP and new password are required." });
    }

    const result = await checkOtp(email, otp);
    if (!result.ok) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "Account not found." });
    }

    user.password = newPassword; // pre-save hook hashes it
    await user.save();
    await Otp.deleteMany({ email });

    res.json({ success: true, message: "Password reset successfully. You can now log in." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  verifyOtp,
  resendOtp,
  loginUser,
  getMe,
  logoutUser,
  forgotPassword,
  resetPassword,
};