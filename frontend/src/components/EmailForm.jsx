import { useState } from "react";

export default function EmailForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <form className="form" onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <label className="field">
        <span className="field-label">Name</span>
        <input className="input" name="name" value={form.name} onChange={change} placeholder="Ada Lovelace" required />
      </label>
      <label className="field">
        <span className="field-label">Email</span>
        <input className="input" type="email" name="email" value={form.email} onChange={change} placeholder="you@example.com" required />
      </label>
      <label className="field">
        <span className="field-label">Password</span>
        <input className="input" type="password" name="password" value={form.password} onChange={change} placeholder="At least 6 characters" minLength={6} required />
      </label>
      <button className="btn btn-primary btn-block" disabled={loading}>
        {loading ? "Sending code…" : "Create account"}
      </button>
    </form>
  );
}