import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signin.css";
import axios from 'axios';
import teacherImage from "../assets/students.jpg";
import { toast } from 'react-toastify';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Check if the user is already logged in and if the token is valid
  const checkLogin = async () => {
    const accessToken = localStorage.getItem("accessToken");
    
    try {
      if (!accessToken) {
        console.log("No token found, please log in.");
        return;
      }
  
      // First, try verifying the user token
      try {
        const response = await axios.get("http://localhost:5000/api/v1/users/verify", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        if (response.status === 200) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.log("User verification failed, trying admin...");
  
        // If user verification fails, proceed with the admin check
        try {
          const response = await axios.get("http://localhost:5000/api/v1/users/verifyadmin", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
  
          if (response.status === 200) {
            navigate("/admin");
          }
        } catch (error) {
          console.error("Invalid token or access denied.");
          // Optionally, show a login prompt or redirect to the login page
        }
      }
    } catch (error) {
      console.error("You have to login again");
    }
  };
  
  useEffect(() => {
    checkLogin();
  }, []);
  
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form reload

    // Dummy authentication logic (Replace with API call)
    if (email === "admin@123.com" && password === "admin_123") {
      try {
        const response = await axios.post('http://localhost:5000/api/v1/users/adminlogin', { email, password });
        const { accessToken, refreshToken } = response.data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("role", "admin");
        navigate("/admin");
        toast.success("Admin logged in successfully!"); // Store admin role
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message); // Show backend error message
        } else {
          toast.error("Login failed. Please try again."); // Generic error message
        }
        console.error("Login failed:", error);
      }
    } else {
      try {
        // Send login request to the backend for student login
        const response = await axios.post('http://localhost:5000/api/v1/users/login', { email, password });

        const { accessToken, refreshToken, user } = response.data.data;

        // Store the tokens in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", user);
        localStorage.setItem("role", "student"); // Assuming user has a role field

        navigate("/dashboard"); // Redirect to student dashboard
        toast.success("User logged in successfully!");
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message); // Show backend error message
        } else {
          toast.error("Login failed. Please try again."); // Generic error message
        }
        console.error("Login failed:", error);
      }
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
