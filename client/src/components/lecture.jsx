// import { Canvas } from "@react-three/fiber";
// import { Experience } from "./Experience";
// import "../styles/lecture.css";
// import React, { useState, useEffect } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import axios from "axios";

// function Lecture() {
//   const location = useLocation();
//   const { video_url, lesson } = location.state || {};
//   const { courseId, studentId } = useParams();

//   const [videoUrl, setVideoUrl] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [context, setContext] = useState([]);
//   const [error, setError] = useState("");
//   const [loadingAnswer, setLoadingAnswer] = useState(false);

//   // Load video: use provided video_url or generate fallback
//   useEffect(() => {
//     const shouldFetch = !video_url;
//     if (shouldFetch) {
//       const fetchLectureVideo = async () => {
//         try {
//           const response = await axios.post("http://localhost:5003/generate-video", {
//             texts: ["Fallback default content..."],
//           });
//           setVideoUrl(`http://localhost:5003${response.data.videoUrl}`);
//         } catch (error) {
//           console.error("Error generating fallback lecture:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchLectureVideo();
//     } else {
//       setVideoUrl(video_url);
//       setLoading(false);
//     }
//   }, [video_url]);

//   // Handle chatbot question submission
//   const handleAskQuestion = async () => {
//     if (!question.trim()) {
//       setError("Please enter a question.");
//       return;
//     }

//     setLoadingAnswer(true);
//     setError("");
//     setAnswer("");
//     setContext([]);

    // try {
    //   const response = await axios.post("http://localhost:5004/ask", {
    //     question,
    //   });
    //   setAnswer(response.data.answer);
    //   setContext(response.data.context || []);
    // } catch (err) {
    //   console.error("Error fetching answer:", err);
    //   setError("Failed to fetch the answer. Please try again.");
    // }

//     setLoadingAnswer(false);
//   };

//   return (
//     <div className="lecturers-page">
//       {/* Heading */}
//       <h2 className="course-name">Course: {courseId}</h2>

//       {/* Main Content */}
//       <div className="lesson-content">
//         {/* 3D Avatar Section */}
//         <div className="avatar-section">
//           <Canvas shadows camera={{ position: [0, 2, 5], fov: 30 }}>
//             <color attach="background" args={["#ECECEC"]} />
//             <Experience />
//           </Canvas>
//         </div>

//         {/* Video Section */}
//         <div className="video-placeholder">
//           {loading ? (
//             <p>Generating lecture...</p>
//           ) : videoUrl ? (
//             <video width="640" controls>
//               <source src={videoUrl} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//           ) : (
//             <p>Failed to load lecture.</p>
//           )}
//         </div>

//         {/* Chatbot Section */}
//         <div className="chatbot-container">
//           <div className="chatbot-box">
//             <input
//               type="text"
//               placeholder="Ask a question..."
//               value={question}
//               onChange={(e) => setQuestion(e.target.value)}
//             />
//             <button onClick={handleAskQuestion} disabled={loadingAnswer}>
//               {loadingAnswer ? "Thinking..." : "Ask"}
//             </button>
//           </div>

//           {error && <p className="text-red-500">{error}</p>}

//           {answer && (
//             <div className="chatbot-response">
//               <h3>:robot_face: AI Answer:</h3>
//               <p>{answer}</p>
//               {context.length > 0 && (
//                 <div className="context-section">
//                   <h4>:page_facing_up: Relevant Document Excerpts:</h4>
//                   {context.map((text, index) => (
//                     <p key={index} className="context-text">
//                       {text}
//                     </p>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Lecture;

import { Canvas } from "@react-three/fiber";
import { Experience } from "./Experience";
import "../styles/lecture.css";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

function Lecture() {
  const location = useLocation();
  const { video_url, lesson } = location.state || {};
  const { courseId, studentId } = useParams();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [videoStatus, setVideoStatus] = useState("loading");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const courseName =
    location.state?.courseName || "Interactive Learning Session";

  // Quick action questions
  const quickQuestions = [
    "Explain this concept",
    "Give me an example",
    "What's the main point?",
    "How does this apply?",
  ];

  useEffect(() => {
    // Simulate video loading
    const timer = setTimeout(() => {
      setVideoStatus("ready");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    // Auto-scroll chat to bottom
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, response]);

  const handleSubmit = async (questionText = question) => {
    if (!questionText.trim() || isLoading) return;

    setIsLoading(true);
    setError("");

    // Add user question to chat history
    const userMessage = {
      type: "user",
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChatHistory((prev) => [...prev, userMessage]);

    try {
      const result = await axios.post(
        `http://localhost:5004/ask`,
        { question: questionText },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 30000,
        }
      );

      if (result.data) {
        const botMessage = {
          type: "bot",
          text: result.data.answer,
          context: result.data.context,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setChatHistory((prev) => [...prev, botMessage]);
        setResponse(result.data.answer);

        // Show success message briefly
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Query error:", err);
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to get response";
      setError(errorMessage);

      const errorBotMessage = {
        type: "error",
        text: errorMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatHistory((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
      setQuestion(""); // Clear input
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickQuestion = (quickQ) => {
    setQuestion(quickQ);
    handleSubmit(quickQ);
  };

  const getAvatarStatus = () => {
    if (isLoading) return "Thinking...";
    if (videoStatus === "loading") return "Initializing...";
    if (chatHistory.length === 0) return "Ready to help";
    return "Active";
  };

  const clearChatHistory = () => {
    setChatHistory([]);
    setResponse("");
    setError("");
  };

  return (
    <div className="lecturers-page">
      {/* Course Header */}
      <h1 className="course-name">{courseName}</h1>

      {/* Main Content Layout */}
      <div className="lesson-content">
        {/* 3D Avatar Section */}
        <div className="avatar-section">
          <div className="avatar-title">AI Assistant</div>
          <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
            <Experience />
          </Canvas>
          <div className="avatar-status">{getAvatarStatus()}</div>
        </div>

        {/* Video Section */}
        <div className="video-placeholder">
          <div className="video-title">Lecture Content</div>
          {loading ? (
            <>
              <div className="loading-spinner"></div>
              <div className="loading-text">Generating lecture...</div>
            </>
          ) : videoUrl ? (
            <video width="640" controls style={{ maxHeight: "70%" }}>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="error-message">Failed to load lecture.</div>
          )}
        </div>

        {/* Interactive Chatbot Section */}
        <div className="chatbot-container" ref={chatContainerRef}>
          <div className="chatbot-header">
            <span>Study Assistant</span>
            {chatHistory.length > 0 && (
              <button
                className="clear-chat-btn"
                onClick={clearChatHistory}
                title="Clear chat history"
              >
                🗑️
              </button>
            )}
          </div>

          {/* Quick Action Buttons */}
          {chatHistory.length === 0 && (
            <div className="quick-actions">
              {quickQuestions.map((quickQ, index) => (
                <button
                  key={index}
                  className="quick-action-btn"
                  onClick={() => handleQuickQuestion(quickQ)}
                  disabled={isLoading}
                >
                  {quickQ}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input */}
          <div className={`chatbot-box ${isInputFocused ? "focused" : ""}`}>
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="Ask me anything about the lesson..."
              disabled={isLoading}
            />
            <button
              onClick={() => handleSubmit()}
              disabled={isLoading || !question.trim()}
            >
              {isLoading ? "..." : "Ask"}
            </button>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="text-green-500">
              ✅ Response generated successfully!
            </div>
          )}

          {/* Error Message */}
          {error && <div className="text-red-500">❌ {error}</div>}

          {/* Chat History */}
          {chatHistory.map((message, index) => (
            <div key={index} className="chatbot-response">
              {message.type === "user" ? (
                <>
                  <h3 style={{ color: "#2563eb" }}>
                    👤 You{" "}
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "normal",
                        opacity: 0.7,
                      }}
                    >
                      ({message.timestamp})
                    </span>
                  </h3>
                  <p>{message.text}</p>
                </>
              ) : message.type === "error" ? (
                <>
                  <h3 style={{ color: "#dc2626" }}>
                    ❌ Error{" "}
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "normal",
                        opacity: 0.7,
                      }}
                    >
                      ({message.timestamp})
                    </span>
                  </h3>
                  <p style={{ color: "#dc2626" }}>{message.text}</p>
                </>
              ) : (
                <>
                  <h3>
                    🤖 AI Assistant{" "}
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "normal",
                        opacity: 0.7,
                      }}
                    >
                      ({message.timestamp})
                    </span>
                  </h3>
                  <p>{message.text}</p>

                  {message.context && message.context.length > 0 && (
                    <div className="context-section">
                      <h4>Reference Material</h4>
                      {message.context.map((ctx, ctxIndex) => (
                        <div key={ctxIndex} className="context-text">
                          {ctx}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {/* Chat Statistics */}
          {chatHistory.length > 0 && (
            <div
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                textAlign: "center",
                marginTop: "16px",
                padding: "8px",
                borderTop: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
              }}
            >
              {chatHistory.filter((msg) => msg.type === "user").length}{" "}
              questions asked •{" "}
              {chatHistory.filter((msg) => msg.type === "bot").length} responses
              received
            </div>
          )}

          {/* Loading indicator at bottom when processing */}
          {isLoading && (
            <div className="loading-indicator">
              <div className="typing-animation">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>AI is thinking...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lecture;
