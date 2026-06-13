import api from "./api";

export const getLeaderboard = (page = 1, limit = 10) =>
  api.get("/leaderboard", { params: { page, limit } });

export const getMyRank = () => api.get("/leaderboard/me");