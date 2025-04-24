import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/progressreport.css";
import Sidebar from "./sidebar";

const ProgressReportPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // Step 1: Get quiz results (quiz_template_id + score_percentage)
        const { data } = await axios.post("http://localhost:5000/api/v1/users/getquizresult", {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}` 
          }
        });

        const quizResults = data.data;

        // Step 2: For each result, fetch quiz title
        const courseData = await Promise.all(quizResults.map(async (result) => {
          const titleRes = await axios.post("http://localhost:5000/api/v1/users/getquiztitle", {
            id: result.quiz_template_id
          });
          return {
            name: titleRes.data.data, // Update based on your backend response key
            progress: result.score_percentage,
            grade: getGrade(result.score_percentage)
          };
        }));

        setCourses(courseData);
      } catch (error) {
        console.error("Failed to load progress data", error);
      }
    };

    fetchProgress();
  }, []);

  const getGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C+";
    if (percentage >= 40) return "D+";
    if (percentage <= 30) return "F";
    return "C";
  };

  return (
    <div className="progress-report-container">
      <Sidebar/>

      <header className="header">
        <h1>Your <span className="highlight">Progress Report</span></h1>
        <p>Track your learning journey and see where you stand!</p>
      </header>

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
