import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "../styles/submitassignment.css"; // Make sure this is linked

const SubmitAssignment = () => {
  const { state } = useLocation();
  const { assignment, title } = state; // Destructure title from state
  const [code, setCode] = useState("");
  const navigate = useNavigate(); // Use useNavigate to navigate back to dashboard

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error("Please write your code before submitting.");
      return;
    }

    try {
      toast.info("Evaluating assignment...");
      
      // First, evaluate the assignment
      const evaluationResponse = await axios.post(
        "http://localhost:5000/api/v1/users/evaluate-assignment",
        {
          sourceCode: code,
          questionPrompt: assignment?.content?.problem,
          expectedOutput: assignment?.content?.expected_output,
          assignment_template_id: assignment.assignment_template_id,
          
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const evaluationData = evaluationResponse.data;
      console.log(evaluationData)
      if (!evaluationData.message) {
        toast.error("Evaluation failed. Please try again.");
        return;
      }

      

      // After successful evaluation, submit the assignment
      const submissionResponse = await axios.post(
        "http://localhost:5000/api/v1/users/submit-assignment-result",
        {
          source_code: code,
          assignment_template_id: assignment.assignment_template_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const submissionData = submissionResponse.data;

      if (submissionData.error) {
        toast.error("Submission failed. Please try again.");
        return;
      }

      toast.success(`Assignment evaluated and Submitted successfully!. Track your Progress in Progress Report Page.`);

      // Navigate back to the dashboard
      navigate("/dashboard"); // Assuming '/dashboard' is your dashboard route

    } catch (error) {
      console.error("Error during assignment submission:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="submit-assignment-page">
      <h2>{title || "Assignment"}</h2>
      
      <div className="assignment-section">
        <h3>🧠 Problem</h3>
        <p>{assignment?.content?.problem}</p>
      </div>

      <div className="assignment-section">
        <h3>📥 Input</h3>
        <pre>{assignment?.content?.input}</pre>
      </div>

      <div className="assignment-section">
        <h3>✅ Expected Output</h3>
        <pre>{assignment?.content?.expected_output}</pre>
      </div>

      <div className="assignment-section">
        <h3>✍️ Starter Code</h3>
        <textarea
          rows="18"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
        />
      </div>

      <div className="submit-button-container">
        <button className="primary-button" onClick={handleSubmit}>
          Submit Code
        </button>
      </div>
    </div>
  );
};

export default SubmitAssignment;
