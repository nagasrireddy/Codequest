import { useState } from "react";

export default function OTPForm({ email, onSubmit, onResend, loading }) {
  const [otp, setOtp] = useState("");

  return (
    <form className="form" onSubmit={(e) => { e.preventDefault(); onSubmit(otp); }}>
      <p className="form-hint">
        We sent a 6-digit code to <strong>{email}</strong>. In development it's printed in the backend console.
      </p>
      <label className="field">
        <span className="field-label">Verification code</span>
        <input
          className="input input-otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="------"
          inputMode="numeric"
          maxLength={6}
          required
        />
      </label>
      <button className="btn btn-primary btn-block" disabled={loading || otp.length !== 6}>
        {loading ? "Verifying…" : "Verify & continue"}
      </button>
      <button type="button" className="btn btn-link" onClick={onResend}>Resend code</button>
    </form>
  );
}