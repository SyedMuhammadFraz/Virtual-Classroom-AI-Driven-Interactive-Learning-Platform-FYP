// Sidebar.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaUserAlt, FaBook, FaClipboardList, FaChartBar, FaSignOutAlt } from "react-icons/fa";  // Importing icons
import ConfirmationModal from "../modals/confirmation-modal";
import "../styles/sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/signin");
  };

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
          <button className="logout-button" onClick={() => setShowModal(true)}>
            <FaSignOutAlt className="sidebar-icon" />
            <span>Log Out</span>
          </button>
        </li>
      </ul>
      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to log out?"
          onConfirm={handleLogout}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
