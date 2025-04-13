import React, { useState, useEffect } from "react";
import "../styles/assignments.css";
import Sidebar from "./sidebar";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const AssignmentsQuizzesPage = () => {
  // State variables
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("assignments");
  const [assignments, setAssignments] = useState([]); // State to store assignments
  const [quizzes, setQuizzes] = useState([]); // State to store quizzes

  // Fetch all assignments
  const fetchAllAssignments = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/getassignments",
        {}
      );

      if (response.status === 200) {
        if (response.data?.data) {
          setAssignments(response.data.data.map(assignment => {
            // Format the due_date if it exists, otherwise default to "No deadline set"
            const formattedDueDate = assignment.due_date
              ? new Date(assignment.due_date).toISOString().split('T')[0] // Convert to YYYY-MM-DD format
              : "No deadline set";

            return {
              id: assignment.id,
              title: assignment.title,
              description: assignment.description,
              lesson: assignment.lesson_id,
              deadline: formattedDueDate,
            };
          }));
        } else {
          toast.error("No Assignments found.");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch Assignments.");
      console.error("Error fetching Assignments:", error);
    }
  };

  // Fetch all quizzes
  const fetchAllQuizzes = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/getquizes",
        {}
      );

      if (response.status === 200) {
        if (response.data?.data) {
          setQuizzes(response.data.data.map(quiz => {
            // Format the created_at date if available, otherwise default to "Not specified"
            const formattedCreatedAt = quiz.created_at
              ? new Date(quiz.created_at).toISOString().split('T')[0] // Convert to YYYY-MM-DD format
              : "Not specified";

            return {
              id: quiz.id,
              title: quiz.title,
              description: "Complete the Following Quiz before the due date . Late Submisson not Allowd",
              lesson: quiz.lesson_id,
              duration: formattedCreatedAt, // Display formatted date or default message
            };
          }));
        } else {
          toast.error("No Quizzes found.");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch Quizzes.");
      console.error("Error fetching Quizzes:", error);
    }
  };


  // Fetch assignments and quizzes when the component mounts
  useEffect(() => {
    fetchAllAssignments();
    fetchAllQuizzes();
  }, []);

  return (
    <div className="assignments-quizzes-container">
      <Sidebar />
      {/* Header Section */}
      <header className="header">
        <h1>
          <span className="highlight">Assignments</span> & <span className="highlight">Quizzes</span>
        </h1>
        <p>Track your progress, complete tasks, and test your knowledge!</p>
      </header>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "assignments" ? "active" : ""}`}
          onClick={() => setActiveTab("assignments")}
        >
          Assignments
        </button>
        <button
          className={`tab-button ${activeTab === "quizzes" ? "active" : ""}`}
          onClick={() => setActiveTab("quizzes")}
        >
          Quizzes
        </button>
      </div>

      {/* Content Section */}
      <div className="content">
        {activeTab === "assignments" && (
          <div className="card-grid">
            {assignments.length === 0 ? (
              <p>No assignments available at the moment.</p>
            ) : (
              assignments.map((assignment) => (
                <div key={assignment.id} className="assignment-card">
                  <div className="card-content">
                    <h3>{assignment.title}</h3>
                    <p>{assignment.description}</p>
                    <p className="details">Deadline: {assignment.deadline}</p>
                    <button className="primary-button">Submit</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "quizzes" && (
          <div className="card-grid">
            {quizzes.length === 0 ? (
              <p>No quizzes available at the moment.</p>
            ) : (
              quizzes.map((quiz) => (
                <div key={quiz.id} className="assignment-card">
                  <div className="card-content">
                    <h3>{quiz.title}</h3>
                    <p>{quiz.description}</p>
                    <p className="details">Duration: {quiz.duration}</p>
                    <button
                      className="primary-button"
                      onClick={() => navigate("/quiz", { state: { title: quiz.title } })}
                    >Start Quiz</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsQuizzesPage;
