import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import "../styles/courses.css";
import axios from "axios";
import Sidebar from "./sidebar";
import { toast } from "react-toastify";

const CoursesPage = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]); // State to store courses
  const [lessons, setLessons] = useState([]); // State to store lessons

  // Fetch courses from the API
  const fetchAllCourses = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/getcourses",
        {}
      );

      if (response.status === 200) {
        if (response.data?.data) {
          setCourses(response.data.data.map((course) => ({
            id: course.id,
            name: course.name,
          })));
        } else {
          toast.error("No courses found.");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch Courses.");
      console.error("Error fetching All Courses:", error);
    }
  };

  // Fetch lessons for the selected course
  const fetchLessonsForCourse = async (courseId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/getlessons",
        { courseId } // Send the courseId to fetch specific lessons
      );

      if (response.status === 200) {
        if (response.data?.data) {
          setLessons(response.data.data.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            description: generateRandomDescription(),
            course: lesson.course_id,
          })));
        } else {
          toast.error("No lessons found.");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch Lessons.");
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
      "Understand the practical aspects and challenges of the topic in real-world scenarios."
    ];
  const randomIndex = Math.floor(Math.random() * descriptions.length);
  return descriptions[randomIndex];
  }  
  // Handle course selection
  const handleCourseClick = (courseId) => {
    setSelectedCourse(courseId); // Set the selected course
    fetchLessonsForCourse(courseId); // Fetch lessons for the selected course
  };

  useEffect(() => {
    fetchAllCourses(); // Fetch courses when the component mounts
  }, []);

  return (
    <div className="courses-page">
      <Sidebar />
      <div className="courses-content">
        <h2>Select a Course</h2>

        {/* Course Selection */}
        <div className="courses-list">
          {courses.map((course) => (
            <div
              key={course.id}
              className="course-card"
              onClick={() => handleCourseClick(course.id)} // On course click, fetch lessons
            >
              <h3>{course.name}</h3>
            </div>
          ))}
        </div>

        {/* Lectures for the Selected Course */}
        {selectedCourse && (
          <div className="lectures-list">
            <h2>Lectures for {courses.find((c) => c.id === selectedCourse)?.name}</h2>
            {lessons
              .filter((lesson) => lesson.course === selectedCourse) // Filter lessons for the selected course
              .map((lesson) => (
                <div
                  key={lesson.id}
                  className="lecture-card"
                  onClick={() => navigate(`/lectures/${lesson.course}`)} // Navigate to LecturesPage for selected lesson
                >
                  <h4>{lesson.title}</h4>
                  <p>{lesson.description}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
