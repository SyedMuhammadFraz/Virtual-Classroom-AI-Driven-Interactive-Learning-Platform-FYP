// Profile.js
import React, { useState } from "react";
import Sidebar from "./sidebar.jsx";
import "../styles/profilepage.css";
import profileImage from "../assets/placeholder.jpg";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    Name: "John Doe",
    Email: "johndoe@example.com",
    DOB: "02/04/2003",
    Contact: "03249876502",
  });

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    console.log("Profile updated:", user);
  };

  return (
    <div className="profile-page">
      <Sidebar />
      <div className="profile-content">
        <div className="profile-header">
          <img src={profileImage} alt="Profile" className="profile-avatar" />
          <h2>{user.Name}</h2>
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
                  name="Name"
                  value={user.Name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="Email"
                  value={user.Email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                DOB:
                <input
                  type="text"
                  name="DOB"
                  value={user.DOB}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Contact:
                <textarea
                  name="Contact"
                  value={user.Contact}
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
              <p>Contact: {user.Contact}</p>
              <button
                className="profile-edit-button"
                onClick={handleEditToggle}
              >
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
