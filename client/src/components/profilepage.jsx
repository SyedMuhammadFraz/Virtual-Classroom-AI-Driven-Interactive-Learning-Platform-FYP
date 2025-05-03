import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar.jsx";
import "../styles/profilepage.css";
import profileImage from "../assets/placeholder.jpg";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    dob: "",
    contact: "",
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

        if (response.status === 200) {
          setUser(response.data.data);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch user profile.");
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSave = async (e) => {

    const loadingToast = toast.loading("Updating your Profile..");
    e.preventDefault();
    setIsEditing(false);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/updateprofile",
        {
          name: user.fullname,
          email: user.email,
          dob: user.dob,
          contact: user.contact,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.dismiss(loadingToast);
        toast.success("Profile updated successfully!");
        console.log("Profile updated:", user);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="profile-page">
      <Sidebar />
      <div className="profile-content">
        <div className="profile-header">
          <img src={profileImage} alt="Profile" className="profile-avatar" />
          <h2>{user.fullname}</h2>
          <p className="profile-role">Role: Student</p>
        </div>

        <div className="profile-info">
          <h3>About Me</h3>

          {isEditing ? (
            <form className="profile-form" onSubmit={handleSave}>
              <label>
                Name:
                <input
                  type="text"
                  name="fullname"
                  value={user.fullname}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                DOB:
                <input
                  type="text"
                  name="dob"
                  value={user.dob}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Contact:
                <textarea
                  name="contact"
                  value={user.contact}
                  onChange={handleChange}
                  required
                />
              </label>
              <button type="submit" className="profile-save-button">
                Save Changes
              </button>
            </form>
          ) : (
            <>
              <p>Contact: {user.contact}</p>
              <button className="profile-edit-button" onClick={handleEditToggle}>
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
