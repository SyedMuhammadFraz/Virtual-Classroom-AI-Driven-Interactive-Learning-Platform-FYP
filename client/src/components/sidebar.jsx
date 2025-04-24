// Sidebar.js
import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaUserAlt, FaBook, FaClipboardList, FaChartBar, FaSignOutAlt } from "react-icons/fa";  // Importing icons
import ConfirmationModal from "../modals/confirmation-modal";
import axios from 'axios';
import "../styles/sidebar.css";
import {toast} from 'react-toastify'

export const HandleLogout = async (navigate) => {
  
  
  const role = localStorage.getItem("role");

  if(role == "student"){
  try {
    // Retrieve the token from localStorage
    const accessToken = localStorage.getItem("accessToken");

    // Make sure the token exists before proceeding
    if (!accessToken) {
      console.log("No token found");
      return;
    }

    // Send the token with the request (In Authorization header)
    const response = await axios.post(
      console.log(accessToken),
      "http://localhost:5000/api/v1/users/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Send token in Authorization header
        } 
      }
    );

    // Handle successful logout
    if (response.status === 200) {

      console.log("Logged out successfully");
      
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user") 
      localStorage.removeItem("role") 
      navigate("/signin")
      toast.success("User logged out successfully!");

      // Clear the token from localStorage
      // Redirect to the login page or any other logic
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message); // Show backend error message
    } else {
      toast.error("Logout failed. Please try again."); // Generic error message
    }
    console.error("Logout failed:", error);
  }

}
else{

  try {
    // Retrieve the token from localStorage
    const accessToken = localStorage.getItem("accessToken");
    console.log(accessToken)

    // Make sure the token exists before proceeding
    if (!accessToken) {
      console.log("No token found");
      return;
    }

    // Send the token with the request (In Authorization header)
    const response = await axios.post(
      "http://localhost:5000/api/v1/users/adminlogout",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Send token in Authorization header
        } 
      }
    );

    // Handle successful logout
    if (response.status === 200) {

      console.log("Logged out successfully");
      
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("role") 
     
      navigate("/signin")
      toast.success("Admin logged out successfully!");

    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message); // Show backend error message
    } else {
      toast.error("Logout failed. Please try again."); // Generic error message
    }
    console.error("Logout failed:", error);
  }
}
};
const Sidebar = () => {
  
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

   
  const [user, setUser] = useState({
    fullname: "",
  });
  useEffect(() => {
    const fetchUserProfile = async () => {
      
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:5000/api/v1/users/getuserdetails",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched User Data:", response.data); 
        if (response.status === 200) {
          
          setUser({ fullname: response.data.data.fullname }); // API returns { data: { name, email, dob, contact } }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch user profile.");
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-profile">
        <img
          src="./Logo.png"
          alt="Profile"
          className="profile-image"
        />
        <p className="profile-name">{user.fullname}</p>
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
          onConfirm={() => HandleLogout(navigate)} 
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};


export default Sidebar;
