// Profile.js
import React, { useState } from "react";
import Sidebar from "./sidebar.jsx";
import "../styles/profilepage.css";
import profileImage from "../assets/placeholder.jpg";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    role: "Student",
    bio: "Passionate about learning new things and exploring AI-based education.",
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
          <h2>{user.name}</h2>
          <p className="profile-role">{user.role}</p>
        </div>

        <div className="profile-info">
          <h3>About Me</h3>
          {isEditing ? (
            <form className="profile-form" onSubmit={handleSave}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={user.name}
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
                Role:
                <input
                  type="text"
                  name="role"
                  value={user.role}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Bio:
                <textarea
                  name="bio"
                  value={user.bio}
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
              <p>{user.bio}</p>
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
