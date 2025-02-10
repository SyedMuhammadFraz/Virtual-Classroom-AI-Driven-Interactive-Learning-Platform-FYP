import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/signin";
import SignUp from "./components/signup";
import Dashboard from "./components/dashboard";
import Profile from "./components/profilepage";
import CoursesPage from "./components/courses";
import AssignmentsQuizzesPage from "./components/assignments";
import ProgressReportPage from "./components/progressreport";
import LecturesPage from "./components/lecture";
import AdminDashboard from "./components/admin-dashboard";
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Student Routes */}
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} requiredRole="student" />} />
        <Route path="/lectures/:courseId" element={<PrivateRoute element={<LecturesPage />} requiredRole="student" />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} requiredRole="student" />} />
        <Route path="/lecture" element={<PrivateRoute element={<CoursesPage />} requiredRole="student" />} />
        <Route path="/assignment" element={<PrivateRoute element={<AssignmentsQuizzesPage />} requiredRole="student" />} />
        <Route path="/progress-report" element={<PrivateRoute element={<ProgressReportPage />} requiredRole="student" />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<PrivateRoute element={<AdminDashboard />} requiredRole="admin" />} />
      </Routes>
    </Router>
  );
};

export default App;
