import { useEffect, useState } from "react";
import * as adminService from "../services/adminService";
import * as questionService from "../services/questionService";

const EMPTY = { title: "", description: "", difficulty: "easy", points: 10, correctAnswer: "" };

export default function AdminPanel() {
  const [form, setForm] = useState(EMPTY);
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    questionService.getQuestions().then(({ data }) => setQuestions(data.questions)).catch(() => {});
    adminService.getUsers().then(({ data }) => setUsers(data.users)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const add = async (e) => {
    e.preventDefault();
    setMsg(""); setError("");
    try {
      await adminService.addQuestion({ ...form, points: Number(form.points) });
      setForm(EMPTY);
      setMsg("Question added.");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add question.");
    }
  };

  const remove = async (id) => {
    setMsg(""); setError("");
    try {
      await adminService.deleteQuestion(id);
      setMsg("Question deleted.");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete question.");
    }
  };

  return (
    <div className="admin">
      <header className="dash-head">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="dash-title">Manage CodeQuest</h1>
        </div>
      </header>

      {msg && <div className="alert alert-info">{msg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="admin-grid">
        <section className="panel">
          <h2 className="section-title">Add a question</h2>
          <form className="form" onSubmit={add}>
            <label className="field">
              <span className="field-label">Title</span>
              <input className="input" name="title" value={form.title} onChange={change} required />
            </label>
            <label className="field">
              <span className="field-label">Description</span>
              <textarea className="input textarea" rows={3} name="description" value={form.description} onChange={change} required />
            </label>
            <div className="field-row">
              <label className="field">
                <span className="field-label">Difficulty</span>
                <select className="input" name="difficulty" value={form.difficulty} onChange={change}>
                  <option value="easy">easy</option>
                  <option value="medium">medium</option>
                  <option value="hard">hard</option>
                </select>
              </label>
              <label className="field">
                <span className="field-label">Points</span>
                <input className="input" type="number" name="points" value={form.points} onChange={change} min={1} required />
              </label>
            </div>
            <label className="field">
              <span className="field-label">Correct answer</span>
              <input className="input code" name="correctAnswer" value={form.correctAnswer} onChange={change} required />
            </label>
            <button className="btn btn-primary btn-block">Add question</button>
          </form>
        </section>

        <section className="panel">
          <h2 className="section-title">Questions ({questions.length})</h2>
          {questions.length === 0 ? (
            <p className="empty">No questions yet.</p>
          ) : (
            <div className="admin-list">
              {questions.map((q) => {
                const diff = (q.difficulty || "easy").toLowerCase();
                return (
                  <div key={q._id} className="admin-row">
                    <div>
                      <span className="admin-row-title">{q.title}</span>
                      <span className={`tag tag-${diff}`}>{diff}</span>
                    </div>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(q._id)}>Delete</button>
                  </div>
                );
              })}
            </div>
          )}

          <h2 className="section-title mt">Users ({users.length})</h2>
          {users.length === 0 ? (
            <p className="empty">No users.</p>
          ) : (
            <div className="admin-list">
              {users.map((u) => (
                <div key={u._id} className="admin-row">
                  <div>
                    <span className="admin-row-title">{u.name}</span>
                    <span className="admin-row-sub">{u.email}</span>
                  </div>
                  <span className={`badge ${u.role === "admin" ? "badge-admin" : ""}`}>{u.role}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}