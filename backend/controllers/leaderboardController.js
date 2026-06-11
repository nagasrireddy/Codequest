const Leaderboard = require("../models/Leaderboard");

// GET /api/leaderboard?page=1&limit=10
const getLeaderboard = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const total = await Leaderboard.countDocuments();

    const rows = await Leaderboard.find()
      .sort({ totalScore: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email");

    // Rank = position in the full sorted list
    const leaderboard = rows.map((row, i) => ({
      rank: skip + i + 1,
      user: row.userId,
      totalScore: row.totalScore,
    }));

    res.json({ success: true, page, count: leaderboard.length, total, leaderboard });
  } catch (error) {
    next(error);
  }
};

// GET /api/leaderboard/me
const getMyRank = async (req, res, next) => {
  try {
    const myRow = await Leaderboard.findOne({ userId: req.user._id });
    const myScore = myRow ? myRow.totalScore : 0;

    // Rank = number of users strictly ahead of me, plus one
    const ahead = await Leaderboard.countDocuments({ totalScore: { $gt: myScore } });

    res.json({ success: true, totalScore: myScore, rank: ahead + 1 });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeaderboard, getMyRank };