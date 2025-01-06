import React from "react";
import "../styles/signup.css";
import teacherImage from "../assets/teacher2.jpg"; // Reusing the image

const SignUp = () => {
  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-left">
          <h1>Virtual Classroom</h1>
          <p>Create Your Account</p>
          <form>
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <input
              type="password"
              placeholder="Confirm Password"
              required
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
