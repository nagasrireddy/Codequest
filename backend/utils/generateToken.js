const jwt = require("jsonwebtoken");

// Sign a JWT carrying the user id; expiry comes from .env
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

module.exports = generateToken;