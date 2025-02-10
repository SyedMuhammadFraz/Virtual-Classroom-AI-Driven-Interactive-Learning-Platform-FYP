import { Canvas } from "@react-three/fiber";
import { Experience } from "./Experience";
import "../styles/lecture.css";
import React from "react";
import { useParams } from "react-router-dom";

function Lecture() {
  const { courseId } = useParams();

  return (
    <div className="lecturers-page">
      {/* Heading */}
      <h2 className="course-name">Selected CourseId: {courseId}</h2>

      {/* Main Content */}
      <div className="content">
        {/* 3D Avatar Section */}
        <div className="avatar-section">
          <Canvas shadows camera={{ position: [0, 2, 5], fov: 30 }}>
            <color attach="background" args={["#ececec"]} />
            <Experience />
          </Canvas>
        </div>

        {/* Video Placeholder Section */}
        <div className="video-placeholder">
          <p>Video Placeholder</p>
        </div>

        {/* Chatbot Section */}
        <div className="chatbot-container">
          <div className="chatbot-box">
            <input type="text" placeholder="Type a message..." />
            <button>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lecture;