import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../styles/quiz.css";

const Quizpage = () => {
  const location = useLocation();
  const quizTitle = location.state?.title || "Quiz";

  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 mins
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (submitted) return;

    toast.info(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to submit the quiz?</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
            <button onClick={() => confirmSubmit(closeToast)} style={{ marginRight: "10px", backgroundColor: "#ff9800", border: "none", padding: "5px 10px", color: "#fff", borderRadius: "4px" }}>
              Yes
            </button>
            <button onClick={closeToast} style={{ backgroundColor: "#ccc", border: "none", padding: "5px 10px", borderRadius: "4px" }}>
              No
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      }
    );
  };

  const confirmSubmit = (closeToast) => {
    closeToast();
    setSubmitted(true);
    toast.success("Quiz submitted successfully! 🚀");
    // You can also add form submission logic here
  };

  const handleAutoSubmit = () => {
    if (!submitted) {
      setSubmitted(true);
      toast.warn("Time's up! Quiz auto-submitted. ⏰");
    }
  };

  const questions = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["Berlin", "London", "Paris", "Madrid"],
      correct: "Paris"
    },
    {
      id: 2,
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correct: "4"
    },
    {
      id: 3,
      question: "React is a ___?",
      options: ["Library", "Framework", "Database", "Language"],
      correct: "Library"
    }
  ];

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <h1 className="project-name">Virtual Classroom</h1>
        <h2 className="quiz-title">{quizTitle}</h2>
        <div className="timer">
          Time Left: <span>{formatTime(timeLeft)}</span>
        </div>
      </header>

      <div className="quiz-content">
        {questions.map((q) => (
          <div key={q.id} className="question-card">
            <h4 className="question-text">{q.question}</h4>
            <div className="options">
              {q.options.map((option, index) => (
                <label key={index} className="option-label">
                  <input type="radio" name={`question-${q.id}`} value={option} />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button className="submit-button" onClick={handleSubmit} disabled={submitted}>
          {submitted ? "Submitted" : "Submit Quiz"}
        </button>
      </div>
    </div>
  );
};

export default Quizpage;
