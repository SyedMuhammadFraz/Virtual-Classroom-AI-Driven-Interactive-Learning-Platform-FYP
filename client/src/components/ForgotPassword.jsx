import React, { useState } from "react";
import "../styles/ForgotPassword.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    if (!email.includes("@")) {
      return setError("Please enter a valid email address.");
    }
    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }
    const loadingToast = toast.loading("Reseting Your Password.Please Be Patient..");
    try {
      const res = await axios.post("http://localhost:5000/api/v1/users/forgetpassword", {
        email,
        newPassword
      });

      if (res.data.success) {
        setSuccess("Password reset successfully! You can now login.");
        setEmail("");
        setNewPassword("");
        setConfirmPassword("");
        toast.dismiss(loadingToast)
        toast.success("Passwrod changed Successfully. Redirecting to Sign In Page..!")
        navigate("/signin")
        
      } else {
        toast.dismiss(loadingToast)
        setError("Failed to reset password. Please try again.");
      }
    } catch (err) {
      toast.dismiss(loadingToast)
      setError("An error occurred while resetting the password.");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Reset Password</h2>
        <p>Enter your email and set a new password.</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input-field"
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input-field"
        />

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <button className="send-otp-btn" onClick={handleResetPassword}>
          Reset Password
        </button>

        <a href="/signin" className="back-to-login">Back to Login</a>
      </div>
    </div>
  );
};

export default ForgotPassword;
