import React, { useEffect, useState } from 'react';
import { useLocation,useNavigate } from "react-router-dom";

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
  const [studentAnswers, setStudentAnswers] = useState([]); // Use an array to store answers
  const [totalScore, setTotalScore] = useState(0);
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

  // Fetch the quiz questions from the server
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        console.log(accessToken)
        if (!accessToken) {
          toast.error("No access token found. Please log in.");
          return;
        }

        const response = await axios.post(
          "http://localhost:5000/api/v1/users/getquiz",
          { quizTemplateId: id }, // send the quiz template ID
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
            },
          }
        );

        setQuestions(response.data.quiz); // Assuming the API returns { quiz: [questions] }
        setLoading(false); // Data loaded, stop loading
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

    // Calculate the total score
    let score = 0;
    let questionsAnswered = [];

    // Loop through questions and calculate score
    questions.forEach((question, index) => {
      const studentAnswer = studentAnswers[index];  // Using index to access student’s answer
      const isCorrect = studentAnswer === question.answer;  // Check if the answer matches

      console.log(`Question Index: ${index}`);
      console.log(`Student Answer: ${studentAnswer}`);
      console.log(`Correct Answer: ${question.answer}`);
      console.log(`Is Correct: ${isCorrect}`);

      if (isCorrect) {
        score++;  // Increment score if correct
      }

      questionsAnswered.push({
        questionId: index, // Using index as the unique identifier
        studentAnswer,
        isCorrect,
      });
    });
    const percentage = (score / questions.length) * 100;
    console.log(`Final Score: ${score}`);
    console.log(`Final Percentage: ${percentage}`);
    console.log(`Questions Answered: ${JSON.stringify(questionsAnswered)}`);

    // Prepare the data to send to the backend
    const quizResultData = {
      quizTemplateId: id,
      totalScore: score,
      scorePercentage:percentage,
      questionsAnswered,
      timeTaken: 5 * 60 - timeLeft, // Time taken in seconds
      completionStatus: "completed",
    };

    // Call the API to save the quiz result
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
      toast.success(response.data.message);
      navigate("/dashboard") 
    } catch (error) {
      toast.error("Error submitting quiz: " + (error.response?.data?.message || error.message));
    }
  };

  const handleAutoSubmit = () => {
    if (!submitted) {
      setSubmitted(true);
      toast.warn("Time's up! Quiz auto-submitted. ⏰");
      confirmSubmit(() => {});
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
                      name={`question-${q.id}`}
                      value={option}
                      checked={studentAnswers[index] === option}  // Check if the option is selected
                      onChange={() => handleAnswerChange(index, option)} // Use index here
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
