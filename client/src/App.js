import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/signin";
import SignUp from "./components/signup";
import Dashboard from "./components/dashboard";
import Profile from "./components/profilepage"
import CoursesPage from "./components/courses"
import AssignmentsQuizzesPage from "./components/assignments";
import ProgressReportPage from "./components/progressreport";
import LecturesPage from "./components/lecture";

// This is the main file

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lectures/:courseId" element={<LecturesPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lecture" element={<CoursesPage />} />
        <Route path="/assignment" element={<AssignmentsQuizzesPage />} />
        <Route path="/progress-report" element={<ProgressReportPage />} />
        <Route path="/videolesson" element={<WhiteboardChatLayout />} />
      </Routes>
    </Router>
  );
};

export default App;
