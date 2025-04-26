import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../styles/quiz.css";

const Quizpage = () => {
  const location = useLocation();
  const { title, id } = location.state || { title: "Quiz", id: null };

  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 mins timer
  const [submitted, setSubmitted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentAnswers, setStudentAnswers] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          toast.error("No access token found. Please log in.");
          return;
        }

        const response = await axios.post(
          "http://localhost:5000/api/v1/users/getquiz",
          { quizTemplateId: id },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
            },
          }
        );

        setQuestions(response.data.quiz);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        toast.error("Failed to fetch quiz. Please try again.");
        setLoading(false);
      }
    };

    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionIndex, answer) => {
    const newAnswers = [...studentAnswers];
    newAnswers[questionIndex] = answer;
    setStudentAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (submitted) return;

    // Check if all questions are answered
    const unansweredIndex = questions.findIndex((_, index) => !studentAnswers[index]);
    if (unansweredIndex !== -1) {
      toast.warn("Please answer all questions before submitting the quiz.");
      return;
    }

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

  const confirmSubmit = async (closeToast) => {
    closeToast();
    setSubmitted(true);
    toast.success("Quiz submitted successfully! 🚀");

    let score = 0;
    let questionsAnswered = [];

    questions.forEach((question, index) => {
      const studentAnswer = studentAnswers[index];
      const isCorrect = studentAnswer === question.answer;

      if (isCorrect) {
        score++;
      }

      questionsAnswered.push({
        questionId: index,
        studentAnswer,
        isCorrect,
      });
    });

    const percentage = (score / questions.length) * 100;

    const quizResultData = {
      quizTemplateId: id,
      totalScore: score,
      scorePercentage: percentage,
      questionsAnswered,
      timeTaken: 5 * 60 - timeLeft,
      completionStatus: "completed",
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/save-result",
        quizResultData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const updateDifficultyResponse = await axios.post(
        "http://localhost:5000/api/v1/users/update-difficulty",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
  
      console.log('Difficulty updated:', updateDifficultyResponse.data);
  
      toast.success(response.data.message + " You can track your Result from Progress Page.");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Error submitting quiz: " + (error.response?.data?.message || error.message));
    }
  };

  const handleAutoSubmit = () => {
    if (!submitted) {
      setSubmitted(true);
      toast.warn("Time's up! Quiz auto-submitted. ⏰");
      confirmSubmit(() => { });
    }
  };

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <h1 className="project-name">Virtual Classroom</h1>
        <h2 className="quiz-title">{title}</h2>
        <div className="timer">
          Time Left: <span>{formatTime(timeLeft)}</span>
        </div>
      </header>

      <div className="quiz-content">
        {loading ? (
          <div>Loading questions...</div>
        ) : (
          questions.map((q, index) => (
            <div key={q.id} className="question-card">
              <h4 className="question-text">{q.question}</h4>
              <div className="options">
                {q.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="option-label">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={studentAnswers[index] === option}
                      onChange={() => handleAnswerChange(index, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))
        )}
        <button className="submit-button" onClick={handleSubmit} disabled={submitted}>
          {submitted ? "Submitted" : "Submit Quiz"}
        </button>
      </div>
    </div>
  );
};

export default Quizpage;
