import React, { useState } from "react";
import axios from "axios";

function EmailForm() {
  const [email, setEmail] = useState("");

  const sendOTP = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        { email }
      );

      alert(res.data.message);
    } catch (err) {
      alert("Failed to send OTP");
    }
  };

  return (
    <div>
      <h2>Email Verification</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={sendOTP}>
        Send OTP
      </button>
    </div>
  );
}

export default EmailForm;