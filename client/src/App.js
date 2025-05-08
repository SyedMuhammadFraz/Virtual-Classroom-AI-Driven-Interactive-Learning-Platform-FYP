import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Public Pages
import LandingPage from './pages/LandingPage';

// Shared Landing Components (only for public pages)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Rectangles from './components/Rectangles';
import Whatsapp from './components/Whatsapp';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';

// Auth & App Pages
import SignIn from "./components/signin";
import Sidebar from "./components/sidebar";
import SignUp from "./components/signup";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/dashboard";
import Profile from "./components/profilepage";
import CoursesPage from "./components/courses";
import AssignmentsQuizzesPage from "./components/assignments";
import ProgressReportPage from "./components/progressreport";
import LecturesPage from "./components/lecture";
import AdminDashboard from "./components/admin-dashboard";
import Quizpage from "./components/quizpage";
import SubmitAssignment from "./components/SubmitAssignment";

// Route Guards
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoutes";

// App Wrapper to access location
function AppWrapper() {
  const location = useLocation();

  // Define public marketing pages where you want the landing UI
  const isLandingPage = location.pathname === "/";

  return (
    <>
      <ToastContainer />

      {isLandingPage && (
        <>
          <Navbar />
          <Whatsapp />
          <ScrollToTop />
          <ScrollToTopButton />
        </>
      )}

      <Routes>
        {/* Landing Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Routes */}
        <Route path="/signin" element={<PublicRoute element={<SignIn />} />} />
        <Route path="/signup" element={<PublicRoute element={<SignUp />} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Student Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              requiredRole="student"
              element={<><Sidebar /><Dashboard /></>}
            />
          }
        />
        <Route
          path="/lectures/:courseId"
          element={
            <PrivateRoute
              requiredRole="student"
              element={<LecturesPage />}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute
              requiredRole="student"
              element={<><Sidebar /><Profile /></>}
            />
          }
        />
        <Route
          path="/lecture"
          element={
            <PrivateRoute
              requiredRole="student"
              element={<><Sidebar /><CoursesPage /></>}
            />
          }
        />
        <Route
          path="/assignment"
          element={
            <PrivateRoute
              requiredRole="student"
              element={<><Sidebar /><AssignmentsQuizzesPage /></>}
            />
          }
        />
        <Route
          path="/progress-report"
          element={
            <PrivateRoute
              requiredRole="student"
              element={<><Sidebar /><ProgressReportPage /></>}
            />
          }
        />
        <Route
          path="/quiz"
          element={
            <PrivateRoute
              requiredRole="student"
              element={<Quizpage />}
            />
          }
        />
        <Route
          path="/submit-assignment"
          element={
            <PrivateRoute
              requiredRole="student"
              element={<SubmitAssignment />}
            />
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <PrivateRoute
              requiredRole="admin"
              element={<AdminDashboard />}
            />
          }
        />
      </Routes>

      {isLandingPage && (
        <>
          <Rectangles />
          <Footer />
        </>
      )}
    </>
  );
}

// Wrap with Router once only
function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
