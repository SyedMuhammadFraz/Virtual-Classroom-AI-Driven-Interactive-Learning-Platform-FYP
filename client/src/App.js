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
import PrivateRoute from "./utils/PrivateRoute"; // Import PrivateRoute
import ForgotPassword from "./components/ForgotPassword";
import { ToastContainer } from "react-toastify";
import Sidebar from "./components/sidebar";
import PublicRoute from "./utils/PublicRoutes";
import Quizpage from "./components/quizpage"; // Import the Quizpage component

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute element={<SignIn />} />} />
        <Route path="/signin" element={<PublicRoute element={<SignIn />} />} />
        <Route path="/signup" element={<PublicRoute element={<SignUp />} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Student Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              element={
                <>
                  <Sidebar />
                  <Dashboard />
                </>
              }
              requiredRole="student"
            />
          }
        />
        <Route
          path="/lectures/:courseId"
          element={
            <PrivateRoute
              element={
                <>
                  <LecturesPage />
                </>
              }
              requiredRole="student"
            />
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute
              element={
                <>
                  <Sidebar />
                  <Profile />
                </>
              }
              requiredRole="student"
            />
          }
        />
        <Route
          path="/lecture"
          element={
            <PrivateRoute
              element={
                <>
                  <Sidebar />
                  <CoursesPage />
                </>
              }
              requiredRole="student"
            />
          }
        />
        <Route
          path="/assignment"
          element={
            <PrivateRoute
              element={
                <>
                  <Sidebar />
                  <AssignmentsQuizzesPage />
                </>
              }
              requiredRole="student"
            />
          }
        />
        <Route
          path="/progress-report"
          element={
            <PrivateRoute
              element={
                <>
                  <Sidebar />
                  <ProgressReportPage />
                </>
              }
              requiredRole="student"
            />
          }
        />

        {/* Quiz Route */}
        <Route
          path="/quiz"
          element={
            <PrivateRoute
              element={
                <>
                  
                  <Quizpage />
                </>
              }
              requiredRole="student"
            />
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute element={<AdminDashboard />} requiredRole="admin" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
