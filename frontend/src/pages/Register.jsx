import React from "react";
import EmailForm from "../components/EmailForm";
import OTPForm from "../components/OTPForm";

function Register() {
  return (
    <div>
      <h1>CodeQuest Registration</h1>

      <EmailForm />
      <br />
      <OTPForm />
    </div>
  );
}

export default Register;