import React, { useState } from "react";
import axios from "axios";

function OTPForm() {
  const [otp, setOtp] = useState("");

  const verifyOTP = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { otp }
      );

      alert(res.data.message);
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={verifyOTP}>
        Verify OTP
      </button>
    </div>
  );
}

export default OTPForm;