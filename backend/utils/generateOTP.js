const crypto = require("crypto");

// Generate a numeric OTP (default 6 digits) using a secure RNG
const generateOTP = (length = 6) => {
  const min = 10 ** (length - 1);
  const max = 10 ** length;
  return String(crypto.randomInt(min, max));
};

module.exports = generateOTP;