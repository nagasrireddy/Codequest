import api from "./api";

export const submitAnswer = (questionId, answer) =>
  api.post("/submissions", { questionId, answer });

export const getMySubmissions = () => api.get("/submissions/me");