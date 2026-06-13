import api from "./api";

export const addQuestion = (data) => api.post("/admin/questions", data);
export const updateQuestion = (id, data) => api.put(`/admin/questions/${id}`, data);
export const deleteQuestion = (id) => api.delete(`/admin/questions/${id}`);
export const getUsers = () => api.get("/admin/users");
export const getAllSubmissions = () => api.get("/admin/submissions");