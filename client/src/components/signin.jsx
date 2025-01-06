import React from "react";
import "../styles/signin.css";
import teacherImage from "../assets/students.jpg"

const SignIn = () => {
  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="signin-left">
          <h1>Virtual Classroom</h1>
          <p>Login to your Account</p>
          <form>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <a href="/forgot-password" className="forgot-password">
              Forgot your Password?
            </a>
            <button type="submit" className="signin-button">
            <a href="/dashboard" className="create-account">
           Submit
          </a>
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
