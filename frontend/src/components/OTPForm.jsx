import React, { useState } from "react";
import axios from "axios";

function OTPForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const verifyOTP = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp
        }
      );

      alert("OTP Verified Successfully");
      console.log("Response:", res.data);

    } catch (err) {
      alert("Invalid OTP");
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <br /><br />

      <button onClick={verifyOTP}>
        Verify OTP
      </button>
    </div>
  );
}

export default OTPForm;