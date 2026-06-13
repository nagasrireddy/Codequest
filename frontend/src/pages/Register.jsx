import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import EmailForm from "../components/EmailForm";
import OTPForm from "../components/OTPForm";
import * as authService from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [step, setStep] = useState("details"); // "details" | "otp"
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDetails = async (form) => {
    setError(""); setInfo(""); setLoading(true);
    try {
      await authService.register(form);
      setEmail(form.email);
      setStep("otp");
      setInfo("Verification code sent. In development, check the backend console.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not start registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async (otp) => {
    setError(""); setLoading(true);
    try {
      const { data } = await authService.verifyOtp({ email, otp });
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(""); setInfo("");
    try {
      await authService.resendOtp(email);
      setInfo("A new code has been sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend code.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{step === "details" ? "Create your account" : "Verify your email"}</h1>
        <p className="auth-sub">
          {step === "details" ? "Join CodeQuest and start solving." : "Enter the code to finish signing up."}
        </p>
        {error && <div className="alert alert-error">{error}</div>}
        {info && <div className="alert alert-info">{info}</div>}
        {step === "details" ? (
          <EmailForm onSubmit={handleDetails} loading={loading} />
        ) : (
          <OTPForm email={email} onSubmit={handleOtp} onResend={handleResend} loading={loading} />
        )}
        <p className="auth-foot">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}