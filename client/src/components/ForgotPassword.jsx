import React, { useState } from "react";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setOtpSent(true);
    // Simulate sending OTP (Replace with API call)
    setTimeout(() => alert("OTP sent to your email!"), 500);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Forgot Password?</h2>
        <p>Enter your email, and we will send you an OTP to reset your password.</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        {error && <p className="error-text">{error}</p>}

        <button className="send-otp-btn" onClick={handleSendOtp}>
          {otpSent ? "Resend OTP" : "Send OTP"}
        </button>

        {otpSent && <p className="otp-message">An OTP has been sent to your email.</p>}

        <a href="/signin" className="back-to-login">Back to Login</a>
      </div>
    </div>
  );
};

export default ForgotPassword;