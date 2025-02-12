import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/progressreport.css";
import Sidebar from "./sidebar";

const ProgressReportPage = () => {
  const courses = [
    { name: "Arrays", progress: 80, grade: "A" },
    { name: "SQL", progress: 60, grade: "B" },
    { name: "Normalization", progress: 90, grade: "A+" },
    { name: "Pointers", progress: 70, grade: "B+" },
  ];

  return (
    <div className="progress-report-container">
      <Sidebar/>

      {/* Header */}
      <header className="header">
        <h1>Your <span className="highlight">Progress Report</span></h1>
        <p>Track your learning journey and see where you stand!</p>
      </header>

      {/* Progress Section */}
      <div className="progress-section">
        {courses.map((course, index) => (
          <div key={index} className="courses-card">
            <h3>{course.name}</h3>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <p className="details">Progress: {course.progress}%</p>
            <p className="grade">Grade: {course.grade}</p>
          </div>
        ))}
      </div>

      {/* Performance Graph */}
      <div className="performance-graph">
        <h2>Performance Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={courses} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="progress" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressReportPage;
