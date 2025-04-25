import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import "../styles/progressreport.css";
import Sidebar from "./sidebar";

const ProgressReportPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        // --- Step 1: Fetch quiz results ---
        const { data: quizData } = await axios.post(
          "http://localhost:5000/api/v1/users/getquizresult",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const quizResults = await Promise.all(
          quizData.data.map(async (result) => {
            const titleRes = await axios.post(
              "http://localhost:5000/api/v1/users/getquiztitle",
              { id: result.quiz_template_id }
            );

            return {
              name: titleRes.data.data,
              progress: result.score_percentage,
              grade: getQuizGrade(result.score_percentage),
              type: "Quiz"
            };
          })
        );

        // --- Step 2: Fetch assignment scores ---
        const { data: assignmentData } = await axios.post(
          "http://localhost:5000/api/v1/users/getassignmentscore",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const assignmentResults = await Promise.all(
          assignmentData.data.map(async (result) => {
            const titleRes = await axios.post(
              "http://localhost:5000/api/v1/users/getassignmenttitle",
              { id: result.assignment_template_id }
            );

            return {
              name: titleRes.data.data,
              progress: result.score,
              grade: getAssignmentGrade(result.score),
              type: "Assignment"
            };
          })
        );

        setCourses([...quizResults, ...assignmentResults]);
      } catch (error) {
        console.error("Failed to load progress data", error);
      }
    };

    fetchProgress();
  }, []);

  // Grading logic for quiz (percentage)
  const getQuizGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C+";
    if (percentage >= 40) return "D+";
    if (percentage <= 30) return "F";
    return "C";
  };

  // Grading logic for assignments (1-10)
  const getAssignmentGrade = (score) => {
    if (score >= 9) return "A+";
    if (score >= 8) return "A";
    if (score >= 7) return "B+";
    if (score >= 6) return "B";
    if (score >= 5) return "C+";
    if (score >= 4) return "D+";
    return "F";
  };

  return (
    <div className="progress-report-container">
      <Sidebar />
      <header className="header">
        <h1>Your <span className="highlight">Progress Report</span></h1>
        <p>Track your learning journey and see where you stand!</p>
      </header>

      <div className="progress-section">
        {courses.map((course, index) => (
          <div key={index} className="courses-card">
            <h3>{course.name} ({course.type})</h3>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${course.progress * (course.type === "Assignment" ? 10 : 1)}%` }}></div>
            </div>
            <p className="details">Score: {course.progress}{course.type === "Quiz" ? "%" : "/10"}</p>
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
