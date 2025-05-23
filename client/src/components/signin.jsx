import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signin.css";
import axios from "axios";
import teacherImage from "../assets/students.jpg";
import { toast } from "react-toastify";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Function to check if the user is already logged in (with valid token)
  const checkLogin = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.log("No token found, please log in.");
      return;
    }

    try {
      const userResponse = await axios.get("http://localhost:5000/api/v1/users/verify", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (userResponse.status === 200) {
        navigate("/dashboard");
        return;
      }
    } catch (error) {
      console.log("User verification failed, trying admin...");
      try {
        const adminResponse = await axios.get("http://localhost:5000/api/v1/users/verifyadmin", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (adminResponse.status === 200) {
          navigate("/admin");
        }
      } catch (error) {
        console.error("Invalid token or access denied.");
      }
    }
  };

  // Handle student login
  const handleStudentLogin = async () => {
    const loadingToast = toast.loading("Checking your credentials, please be patient...");
    try {
      const response = await axios.post("http://localhost:5000/api/v1/users/login", { email, password });
      const { accessToken, refreshToken, user } = response.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", "student");

      toast.dismiss(loadingToast);
      toast.success("User logged in successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.dismiss(loadingToast);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Login failed. Please try again.");
      } else {
        toast.error("Login failed. Please try again.");
      }
      console.error("Student login failed:", error);
    }
  };

  // Handle admin login
  const handleAdminLogin = async () => {
    const loadingToast = toast.loading("Checking your credentials, please be patient...");
    try {
      const response = await axios.post("http://localhost:5000/api/v1/users/adminlogin", { email, password });
      const { accessToken, refreshToken } = response.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", "admin");

      toast.dismiss(loadingToast);
      toast.success("Admin logged in successfully!");
      navigate("/admin");
    } catch (error) {
      toast.dismiss(loadingToast);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Login failed. Please try again.");
      } else {
        toast.error("Login failed. Please try again.");
      }
      console.error("Admin login failed:", error);
    }
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    if (email === "admin@123.com" && password === "admin_123") {
      handleAdminLogin();
    } else {
      handleStudentLogin();
    }
  };

  useEffect(() => {
    console.log("Checking login status...");
    checkLogin();
  }, []);

  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="signin-left">
          <h1>Virtual Classroom</h1>
          <p>Login to your Account</p>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              autoComplete="false"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              autoComplete="false"
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
