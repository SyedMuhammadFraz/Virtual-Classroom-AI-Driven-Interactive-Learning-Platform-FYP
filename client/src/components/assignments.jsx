import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/assignments.css";
import Sidebar from "./sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const AssignmentsQuizzesPage = () => {
  const [activeTab, setActiveTab] = useState("assignments");
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchAllAssignments = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post("http://localhost:5000/api/v1/users/getassignments");

      if (response.status === 200 && response.data?.data) {
        const assignmentsWithStatus = await Promise.all(
          response.data.data.map(async (assignment) => {
            try {
              const res = await axios.post(
                "http://localhost:5000/api/v1/users/getassignmentbyid",
                { assignment_template_id: assignment.id },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              return {
                id: assignment.id,
                title: assignment.title,
                description: assignment.description,
                lesson: assignment.lesson_id,
                deadline: assignment.due_date
                  ? new Date(assignment.due_date).toISOString().split("T")[0]
                  : "No deadline set",
                submitted: res.data.submitted || false,
              };
            } catch (err) {
              return {
                id: assignment.id,
                title: assignment.title,
                description: assignment.description,
                lesson: assignment.lesson_id,
                deadline: assignment.due_date
                  ? new Date(assignment.due_date).toISOString().split("T")[0]
                  : "No deadline set",
                submitted: false,
              };
            }
          })
        );

        setAssignments(assignmentsWithStatus);
      } else {
        toast.error("No Assignments found.");
      }
    } catch (error) {
      toast.error("Failed to fetch Assignments.");
    }
  };

  const fetchAllQuizzes = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/v1/users/getquizes");
      if (response.status === 200 && response.data?.data) {
        setQuizzes(
          response.data.data.map((quiz) => ({
            id: quiz.id,
            title: quiz.title,
            description: "Complete the following quiz before the due date.",
            lesson: quiz.lesson_id,
            duration: quiz.created_at
              ? new Date(quiz.created_at).toISOString().split("T")[0]
              : "Not specified",
          }))
        );
      } else {
        toast.error("No Quizzes found.");
      }
    } catch (error) {
      toast.error("Failed to fetch Quizzes.");
    }
  };

  useEffect(() => {
    fetchAllAssignments();
    fetchAllQuizzes();
  }, []);

  const getCourseTitleById = async (lessonId) => {
    return "Course Title";
  };

  const handleAssignmentSubmit = async (assignment) => {
    if (isSubmitting || assignment.submitted) return;

    setIsSubmitting(true);
    try {
      toast.info("Generating assignment...");
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/generate-assignment-for-student",
        { assignment_template_id: assignment.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/submit-assignment", {
        state: {
          title: assignment.title,
          assignment: response.data,
        },
      });

      toast.dismiss();
    } catch (error) {
      toast.error("Failed to generate assignment.");
      toast.dismiss();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="assignment-page-container">
      <Sidebar />
      <header className="assignment-header">
        <h1>
          <span className="assignment-highlight">Assignments</span> &{" "}
          <span className="assignment-highlight">Quizzes</span>
        </h1>
        <p>Track your progress, complete tasks, and test your knowledge!</p>
      </header>

      <div className="assignment-tabs">
        <button
          className={`assignment-tab-button ${
            activeTab === "assignments" ? "active" : ""
          }`}
          onClick={() => setActiveTab("assignments")}
        >
          Assignments
        </button>
        <button
          className={`assignment-tab-button ${
            activeTab === "quizzes" ? "active" : ""
          }`}
          onClick={() => setActiveTab("quizzes")}
        >
          Quizzes
        </button>
      </div>

      <div className="assignment-card-grid">
        {activeTab === "assignments" &&
          (assignments.length === 0 ? (
            <p>No assignments available at the moment.</p>
          ) : (
            assignments.map((assignment) => (
              <div key={assignment.id} className="assignment-card">
                <div className="assignment-card-content">
                  <h3>{assignment.title}</h3>
                  <p>{assignment.description}</p>
                  <p className="assignment-details">
                    Deadline: {assignment.deadline}
                  </p>
                  <button
                    className={`assignment-button ${
                      assignment.submitted ? "submitted" : ""
                    }`}
                    onClick={() => handleAssignmentSubmit(assignment)}
                    disabled={isSubmitting || assignment.submitted}
                  >
                    {assignment.submitted ? "Submitted" : "Submit"}
                  </button>
                </div>
              </div>
            ))
          ))}

        {activeTab === "quizzes" &&
          (quizzes.length === 0 ? (
            <p>No quizzes available at the moment.</p>
          ) : (
            quizzes.map((quiz) => (
              <div key={quiz.id} className="assignment-card">
                <div className="assignment-card-content">
                  <h3>{quiz.title}</h3>
                  <p>{quiz.description}</p>
                  <p className="assignment-details">Date: {quiz.duration}</p>
                  <button
                    className="assignment-button"
                    onClick={async () => {
                      try {
                        toast.info("Please wait, starting your quiz...");
                        const courseTitle = await getCourseTitleById(quiz.lesson);
                        const token = localStorage.getItem("accessToken");

                        const response = await axios.post(
                          "http://localhost:5000/api/v1/users/generateQuiz",
                          {
                            lessonId: quiz.lesson,
                            lessonName: quiz.title,
                            course: courseTitle,
                            quizTemplateId: quiz.id,
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );

                        const data = response.data;

                        navigate("/quiz", {
                          state: {
                            title: quiz.title,
                            id: quiz.id,
                            questions: data.quiz,
                          },
                        });

                        toast.dismiss();
                      } catch (error) {
                        console.error("Error:", error.response?.data?.error || error.message);
                        alert(error.response?.data?.error || "Failed to generate quiz");
                        toast.dismiss();
                      }
                    }}
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            ))
          ))}
      </div>
    </div>
  );
};

export default AssignmentsQuizzesPage;
