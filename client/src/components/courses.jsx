import React, { useState } from "react";
import "../styles/courses.css";
import Sidebar from "./sidebar";

const CoursesPage = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Sample data for courses and lectures
  const courses = [
    { id: 1, name: "Programming Fundamentals" },
    { id: 2, name: "Web Development" },
    { id: 3, name: "Data Structures" },
  ];

  const lectures = {
    1: [
      { id: 1, title: "Introduction to Programming", description: "Learn the basics of programming." },
      { id: 2, title: "Control Structures", description: "Understand loops and conditionals." },
      { id: 3, title: "Functions", description: "Learn about reusable code blocks." },
    ],
    2: [
      { id: 4, title: "HTML Basics", description: "Learn the structure of web pages." },
      { id: 5, title: "CSS Fundamentals", description: "Style your web pages with CSS." },
      { id: 6, title: "JavaScript", description: "Add interactivity to your websites." },
    ],
    3: [
      { id: 7, title: "Arrays", description: "Understand array data structures." },
      { id: 8, title: "Linked Lists", description: "Learn about linked list implementations." },
      { id: 9, title: "Trees", description: "Explore tree-based data structures." },
    ],
  };

  const handleCourseClick = (courseId) => {
    setSelectedCourse(courseId);
  };

  return (
    <div className="courses-page">
      <Sidebar/>
      <div className="courses-content">
        <h2>Select a Course</h2>
        {/* Course Selection */}
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

        {/* Lectures for the Selected Course */}
        {selectedCourse && (
          <div className="lectures-list">
            <h2>Lectures for {courses.find((c) => c.id === selectedCourse)?.name}</h2>
            {lectures[selectedCourse]?.map((lecture) => (
              <div key={lecture.id} className="lecture-card">
                <h4>{lecture.title}</h4>
                <p>{lecture.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
