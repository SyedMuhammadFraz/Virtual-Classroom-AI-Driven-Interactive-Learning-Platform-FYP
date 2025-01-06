import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/signin";
import SignUp from "./components/signup";
import Dashboard from "./components/dashboard";
import Profile from "./components/profilepage"
import CoursesPage from "./components/courses"
import AssignmentsQuizzesPage from "./components/assignments";
import ProgressReportPage from "./components/progressreport";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lecture" element={<CoursesPage />} />
        <Route path="/assignment" element={<AssignmentsQuizzesPage />} />
        <Route path="/progress-report" element={<ProgressReportPage />} />
      </Routes>
    </Router>
  );
};

export default App;
