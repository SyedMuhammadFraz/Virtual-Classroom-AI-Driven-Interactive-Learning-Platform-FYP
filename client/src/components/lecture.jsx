import { Canvas } from "@react-three/fiber";
import { Experience } from "./Experience";
import "../styles/lecture.css";
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

function Lecture() {
  const location = useLocation();
  const { video_url, lesson } = location.state || {};
  const { courseId, studentId } = useParams();

  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [context, setContext] = useState([]);
  const [error, setError] = useState("");
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  // Load video: use provided video_url or generate fallback
  useEffect(() => {
    const shouldFetch = !video_url;
    if (shouldFetch) {
      const fetchLectureVideo = async () => {
        try {
          const response = await axios.post("http://localhost:5003/generate-video", {
            texts: ["Fallback default content..."],
          });
          setVideoUrl(`http://localhost:5003${response.data.videoUrl}`);
        } catch (error) {
          console.error("Error generating fallback lecture:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchLectureVideo();
    } else {
      setVideoUrl(video_url);
      setLoading(false);
    }
  }, [video_url]);

  // Handle chatbot question submission
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
      const response = await axios.post("http://localhost:5004/ask", {
        question,
      });
      setAnswer(response.data.answer);
      setContext(response.data.context || []);
    } catch (err) {
      console.error("Error fetching answer:", err);
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
            <color attach="background" args={["#ECECEC"]} />
            <Experience />
          </Canvas>
        </div>

        {/* Video Section */}
        <div className="video-placeholder">
          {loading ? (
            <p>Generating lecture...</p>
          ) : videoUrl ? (
            <video width="640" controls>
              <source src={videoUrl} type="video/mp4" />
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
              <h3>:robot_face: AI Answer:</h3>
              <p>{answer}</p>
              {context.length > 0 && (
                <div className="context-section">
                  <h4>:page_facing_up: Relevant Document Excerpts:</h4>
                  {context.map((text, index) => (
                    <p key={index} className="context-text">
                      {text}
                    </p>
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
