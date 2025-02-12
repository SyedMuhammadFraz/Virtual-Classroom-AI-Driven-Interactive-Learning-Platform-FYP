import { Canvas } from "@react-three/fiber";
import { Experience } from "./Experience";
import "../styles/lecture.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Lecture() {
  const { courseId, studentId } = useParams();
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [context, setContext] = useState([]);
  const [error, setError] = useState("");
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  useEffect(() => {
    const fetchLectureVideo = async () => {
      try {
        // Dummy performance data
        const performanceData = {
          studentId: studentId || "123",
          performance: 68,
          weakTopics: ["Loops", "Functions"],
        };

        console.log("Performance Data:", performanceData);

        // Dummy lesson generation based on weak topics
        const lessonTexts = [
          "Understanding Loops in JavaScript",
          "A loop allows a program to run a block of code multiple times without repetition.",
          "Loops help automate repetitive tasks, making code more efficient and readable.",
          "There are different types of loops in JavaScript, such as for, while, and do...while loops.",
          "The 'for' loop is commonly used when the number of iterations is known beforehand.",
          "A 'while' loop continues running as long as a specific condition remains true.",
          "The 'do...while' loop ensures the code runs at least once before checking the condition.",
          "Example: A 'for' loop can iterate through an array of student names.",
          "Using loops, you can perform operations like summing numbers, modifying arrays, and more.",
          "Functions help in structuring your code better and can be used inside loops to organize logic.",
        ];

        console.log("Generated Lesson:", lessonTexts);

        // Send texts to Python API to generate video
        const response = await axios.post(
          "http://localhost:5000/generate-video",
          {
            texts: lessonTexts,
          }
        );

        setVideoUrl(
          `http://localhost:5000${response.data.videoUrl}?t=${new Date().getTime()}`
        );
        setLoading(false);
      } catch (error) {
        console.error("Error generating lecture:", error);
        setLoading(false);
      }
    };

    fetchLectureVideo();
  }, [studentId, courseId]);

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }
    setLoadingAnswer(true);
    setError("");
    setAnswer("");
    setContext([]);
    try {
      const response = await axios.post("http://localhost:5002/ask", { question });
      setAnswer(response.data.answer);
      setContext(response.data.context || []);
    } catch (err) {
      setError("Failed to fetch the answer. Please try again.");
    }
    setLoadingAnswer(false);
  };

  return (
    <div className="lecturers-page">
      {/* Heading */}
      <h2 className="course-name">Course: {courseId}</h2>

      {/* Main Content */}
      <div className="lesson-content">
        {/* 3D Avatar Section */}
        <div className="avatar-section">
          <Canvas shadows camera={{ position: [0, 2, 5], fov: 30 }}>
            <color attach="background" args={["#ececec"]} />
            <Experience />
          </Canvas>
        </div>

        {/* Video Section */}
        <div className="video-placeholder">
          {loading ? (
            <p>Generating lecture...</p>
          ) : videoUrl ? (
            <video width="640" controls>
              <source src='/Output Video.mp4' type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p>Failed to load lecture.</p>
          )}
        </div>

        {/* Chatbot Section */}
        <div className="chatbot-container">
          <div className="chatbot-box">
            <input
              type="text"
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button onClick={handleAskQuestion} disabled={loadingAnswer}>
              {loadingAnswer ? "Thinking..." : "Ask"}
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {answer && (
            <div className="chatbot-response">
              <h3>🤖 AI Answer:</h3>
              <p>{answer}</p>
              {context.length > 0 && (
                <div className="context-section">
                  <h4>📄 Relevant Document Excerpts:</h4>
                  {context.map((text, index) => (
                    <p key={index} className="context-text">{text}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lecture;
