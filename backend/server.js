require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "CodeQuest API is running" });
});

// Routes get mounted here as we build them:
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/questions", require("./routes/questionRoutes"));
// app.use("/api/submissions", require("./routes/submissionRoutes"));
// app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));