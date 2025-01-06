import React from "react";
import "../styles/dashboard.css";
import Sidebar from "./sidebar";

// Import SVGs
import { ReactComponent as SvgImage1 } from "../assets/teacher.svg";
import { ReactComponent as SvgImage2 } from "../assets/educator.svg";
import { ReactComponent as SvgImage3 } from "../assets/support.svg";
import { ReactComponent as SvgImage4 } from "../assets/tutorial.svg";
import { ReactComponent as SvgImage5 } from "../assets/quiz.svg";
import { ReactComponent as SvgImage6 } from "../assets/online learning.svg";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="dashboard-main">
        <h1>Welcome to <span className="highlight">Virtual Classroom</span></h1>
        <p>
          Experience personalized learning with our AI-powered teacher and
          interactive 3D lessons...!
        </p>

        {/* Grid of SVGs */}
        <div className="image-grid">
          <SvgImage1 className="image-item" />
          <SvgImage2 className="image-item" />
          <SvgImage3 className="image-item" />
          <SvgImage4 className="image-item" />
          <SvgImage5 className="image-item" />
          <SvgImage6 className="image-item" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
