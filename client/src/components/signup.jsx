import React, { useState } from "react";
import "../styles/signup.css";
import teacherImage from "../assets/teacher2.jpg"; // Reusing the image
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [fullname, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const role = "user";

  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent form reload

    // Basic validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      // Send registration data to the backend
      const response = await axios.post("http://localhost:5000/api/v1/users/register", {
        username,
        fullname,
        email,
        password,
        role,
        dob,
        contact,
      });

      // Handle successful registration
        // Display success toast
        toast.success("Registration successful! Redirecting to sign-in...");
        // Clear form fields
        setUsername("");
        setFullName("");
        setEmail("");
        setPassword("");
        setContact("");
        setDob("");

        // Navigate to sign-in page after 2 seconds
        setTimeout(() => navigate("/signin"), 2000);
    } catch (error) {
      console.error("Registration failed:", error);

      // Display error toast
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Show backend error message
      } else {
        toast.error("Registration failed. Please try again."); // Generic error message
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-left">
          <h1>Virtual Classroom</h1>
          <p>Create Your Account</p>
          <form onSubmit={handleSignUp}>
            <input
              type="text"
              placeholder="Full Name"
              required
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Contact Number"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>
          <a href="/signin" className="login-account">
            Already have an account? Login
          </a>
        </div>
        <div className="signup-right">
          <img
            src={teacherImage}
            alt="Virtual Classroom Characters"
            className="teacher-image"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;