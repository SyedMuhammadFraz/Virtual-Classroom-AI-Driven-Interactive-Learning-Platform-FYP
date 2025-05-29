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
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/getcourses",
        {}
      );

      if (response.status === 200) {
        if (response.data?.data) {
          setCourses(
            response.data.data.map((course) => ({
              id: course.id,
              name: course.name,
            }))
          );
        } else {
          toast.error("No courses found.");
        }
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

      if (response.status === 200) {
        if (response.data?.data) {
          setLessons(
            response.data.data.map((lesson) => ({
              id: lesson.id,
              title: lesson.title,
              description: generateRandomDescription(),
              course: lesson.course_id,
            }))
          );
        } else {
          toast.error("No lessons found.");
        }
      }
    } catch (error) {
      toast.error("Failed to fetch Lessons.");
      console.error("Error fetching Lessons:", error);
    }
  };

  const generateRandomDescription = () => {
    const descriptions = [
      "This lesson covers the core concepts and fundamentals of the topic.",
      "A comprehensive overview of the essential principles and techniques.",
      "Dive deeper into the topic with practical examples and applications.",
      "Gain a solid understanding of the foundational aspects of this subject.",
      "Learn key strategies and approaches to master this subject efficiently.",
      "Explore advanced concepts and hands-on examples to boost your skills.",
      "This lesson introduces essential methods and tools to help you excel.",
      "Understand the practical aspects and challenges of the topic in real-world scenarios.",
    ];
    const randomIndex = Math.floor(Math.random() * descriptions.length);
    return descriptions[randomIndex];
  };
  // Handle course selection
  const handleCourseClick = (courseId) => {
    setSelectedCourse(courseId); // Set the selected course
    fetchLessonsForCourse(courseId); // Fetch lessons for the selected course
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const handleLessonClick = async (lesson) => {
  try {
    toast.info("Generating video, please wait...");

    const response = await axios.post("http://localhost:5002/generate_lesson", {
      topic: lesson.title
    });

    if (response.data && response.data.video_url) {
      toast.success("Lesson generated!");
      
      // Navigate and pass video data via state (optional)
      navigate(`/lectures/${lesson.course}`, {
        state: {
          lesson,
          video_url: response.data.video_url,
          image_url: response.data.image_url
        }
      });

    } else {
      toast.error("Video not generated. Try again.");
    }
  } catch (error) {
    console.error("Error generating lesson:", error);
    toast.error("Failed to generate video.");
  }
};


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
            <h2>
              Lectures for {courses.find((c) => c.id === selectedCourse)?.name}
            </h2>
            {lessons
              .filter((lesson) => lesson.course === selectedCourse)
              .map((lesson) => (
                <div
                  key={lesson.id}
                  className="lecture-card"
                  onClick={() => handleLessonClick(lesson)}
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
