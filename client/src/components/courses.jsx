import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/courses.css";
import axios from "axios";
import Sidebar from "./sidebar";
import { toast } from "react-toastify";
import ConfirmationModal from "../modals/confirmation-modal"; // Assuming you have the modal component

const CoursesPage = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [pendingCourseId, setPendingCourseId] = useState(null); // Track course to enroll in
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const getToken = () => localStorage.getItem("accessToken");

  const fetchAllCourses = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/v1/users/getcourses", {});
      if (response.status === 200 && response.data?.data) {
        setCourses(response.data.data.map(course => ({
          id: course.id,
          name: course.name,
        })));
      } else {
        toast.error("No courses found.");
      }
    } catch (error) {
      toast.error("Failed to fetch Courses.");
      console.error("Error fetching All Courses:", error);
    }
  };

  const fetchLessonsForCourse = async (courseId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/getlessons",
        { courseId }
      );

      if (response.status === 200 && response.data?.data) {
        setLessons(response.data.data.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          description: generateRandomDescription(),
          course: lesson.course_id,
        })));
      } else {
        toast.error("No lessons found.");
      }
    } catch (error) {
      toast.error("Failed to fetch Lessons.");
      console.error("Error fetching Lessons:", error);
    }
  };

  const generateRandomDescription = () => {
    const descriptions = [
      "This lesson covers the core concepts.",
      "A comprehensive overview of key ideas.",
      "Dive deeper with practical examples.",
      "Understand foundational aspects.",
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const handleCourseClick = async (courseId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/getenrolldetails",
        { course_id: courseId },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const isEnrolled = response.data?.data?.isEnrolled;

      if (isEnrolled) {
        setSelectedCourse(courseId);
        fetchLessonsForCourse(courseId);
      } else {
        setPendingCourseId(courseId); // Store the course ID to enroll in
        setShowModal(true); // Show the confirmation modal
      }
    } catch (error) {
      toast.error("Error checking enrollment.");
      console.error("Enrollment check failed:", error);
    }
  };

  const enrollInCourse = async () => {
    const loadingToast = toast.loading("Enrolling in Course . Be Patient");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/enrollcourse",
        { course_id: pendingCourseId },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        toast.dismiss(loadingToast);  // Dismiss loading toast if it's still showing
        toast.success(response.data.message || "Enrolled successfully!");
        setSelectedCourse(pendingCourseId);
        fetchLessonsForCourse(pendingCourseId);
      } else {
        toast.error(response.data.message || "Error enrolling in the course.");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to enroll.");
      console.error("Enroll error:", error);
    } finally {
      setShowModal(false); // Close the modal after enrollment
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  return (
    <div className="courses-page">
      <Sidebar />
      <div className="courses-content">
        <h2>Select a Course</h2>

        <div className="courses-list">
          {courses.map((course) => (
            <div
              key={course.id}
              className="course-card"
              onClick={() => handleCourseClick(course.id)}
            >
              <h3>{course.name}</h3>
            </div>
          ))}
        </div>

        {selectedCourse && (
          <div className="lectures-list">
            <h2>Lectures for {courses.find((c) => c.id === selectedCourse)?.name}</h2>
            {lessons
              .filter((lesson) => lesson.course === selectedCourse)
              .map((lesson) => (
                <div
                  key={lesson.id}
                  className="lecture-card"
                  onClick={() => navigate(`/lectures/${lesson.course}`)}
                >
                  <h4>{lesson.title}</h4>
                  <p>{lesson.description}</p>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Enrollment */}
      {showModal && (
        <ConfirmationModal
          message="You're not enrolled in this course. Do you want to enroll now?"
          onConfirm={enrollInCourse} // Call enrollInCourse if confirmed
          onCancel={() => setShowModal(false)} // Close the modal if canceled
        />
      )}
    </div>
  );
};

export default CoursesPage;
