import { Canvas } from "@react-three/fiber";
import { Experience } from "./Experience";
import "../styles/lecture.css";
import React from "react";
import Sidebar from "./sidebar";
import { useParams } from "react-router-dom";

function Lecture() {

  const { courseId} = useParams(); 
  return (
    <div className="lecturers-page">
      <Sidebar />
      <div className="content">
        <h2 className="course-name"> Selected CourseId :{courseId}</h2>
        <Canvas shadows camera={{ position: [0, 2, 5], fov: 30 }}>
          <color attach="background" args={["#ececec"]} />
          <Experience />
        </Canvas>
      </div>
    </div>
  );
}

export default Lecture;
