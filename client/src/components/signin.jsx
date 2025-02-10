import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signin.css";
import teacherImage from "../assets/students.jpg";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent form reload

    // Dummy authentication logic (Replace with API call)
    if (email === "admin@example.com" && password === "adminpass") {
      localStorage.setItem("token", "yourAuthToken"); 
      localStorage.setItem("role", "admin"); // Store admin role
      navigate("/admin");
    } else if (email === "student@example.com" && password === "studentpass") {
      localStorage.setItem("token", "yourAuthToken");
      localStorage.setItem("role", "student"); // Store student role
      navigate("/dashboard");
    } else {
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="signin-left">
          <h1>Virtual Classroom</h1>
          <p>Login to your Account</p>
          <form onSubmit={handleLogin}>
            <input 
              type="email" 
              placeholder="Email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <a href="/forgot-password" className="forgot-password">
              Forgot your Password?
            </a>
            <button type="submit" className="signin-button">
              Login
            </button>
          </form>
          <a href="/signup" className="create-account">
            Create Account
          </a>
        </div>
        <div className="signin-right">
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

export default SignIn;
