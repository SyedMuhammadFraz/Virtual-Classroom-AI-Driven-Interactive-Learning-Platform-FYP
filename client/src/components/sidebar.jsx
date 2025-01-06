// Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUserAlt, FaBook, FaClipboardList, FaChartBar, FaSignOutAlt } from "react-icons/fa";  // Importing icons
import "../styles/sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-profile">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile"
          className="profile-image"
        />
        <p className="profile-name">John Doe</p>
      </div>
      <ul className="sidebar-links">
        <li>
          <Link to="/dashboard">
            <FaHome className="sidebar-icon" />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <FaUserAlt className="sidebar-icon" />
            <span>Profile</span>
          </Link>
        </li>
        <li>
          <Link to="/lecture">
            <FaBook className="sidebar-icon" />
            <span>Lecture</span>
          </Link>
        </li>
        <li>
          <Link to="/assignment">
            <FaClipboardList className="sidebar-icon" />
            <span>Assignment</span>
          </Link>
        </li>
        <li>
          <Link to="/progress-report">
            <FaChartBar className="sidebar-icon" />
            <span>Progress Report</span>
          </Link>
        </li>
        <li>
          <button className="logout-button">
            <FaSignOutAlt className="sidebar-icon" />
            <span>Log Out</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
