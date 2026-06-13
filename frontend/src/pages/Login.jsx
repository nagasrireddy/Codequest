import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as authService from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await authService.login(form);
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Log in to continue your quest.</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form className="form" onSubmit={submit}>
          <label className="field">
            <span className="field-label">Email</span>
            <input className="input" type="email" name="email" value={form.email} onChange={change} required />
          </label>
          <label className="field">
            <span className="field-label">Password</span>
            <input className="input" type="password" name="password" value={form.password} onChange={change} required />
          </label>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p className="auth-foot">No account? <Link to="/register">Create one</Link></p>
      </div>
    </div>
  );
}