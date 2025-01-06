import React, { useState } from "react";
import "../styles/assignments.css";
import Sidebar from "./sidebar";

const AssignmentsQuizzesPage = () => {
  const [activeTab, setActiveTab] = useState("assignments"); // Manage active tab

  const assignments = [
    { id: 1, title: "Assignment 1", description: "Solve basic math problems.", deadline: "2024-12-01" },
    { id: 2, title: "Assignment 2", description: "Write an essay on climate change.", deadline: "2024-12-05" },
    { id: 3, title: "Assignment 3", description: "Create a small React app.", deadline: "2024-12-10" },
  ];

  const quizzes = [
    { id: 1, title: "Quiz 1", description: "Basic Science Quiz", duration: "10 minutes" },
    { id: 2, title: "Quiz 2", description: "History Quiz", duration: "15 minutes" },
    { id: 3, title: "Quiz 3", description: "General Knowledge", duration: "20 minutes" },
  ];

  return (
    <div className="assignments-quizzes-container">
    <Sidebar/>
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
            {assignments.map((assignment) => (
              <div key={assignment.id} className="card">
                <div className="card-content">
                  <h3>{assignment.title}</h3>
                  <p>{assignment.description}</p>
                  <p className="details">Deadline: {assignment.deadline}</p>
                  <button className="primary-button">Submit</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "quizzes" && (
          <div className="card-grid">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="card">
                <div className="card-content">
                  <h3>{quiz.title}</h3>
                  <p>{quiz.description}</p>
                  <p className="details">Duration: {quiz.duration}</p>
                  <button className="primary-button">Start Quiz</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsQuizzesPage;
