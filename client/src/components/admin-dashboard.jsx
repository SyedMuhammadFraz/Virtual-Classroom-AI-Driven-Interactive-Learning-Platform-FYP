import React, { useState, useEffect } from "react";
import "../styles/admin-dashboard.css";

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);
  const [testReports, setTestReports] = useState([]);

  const [courseName, setCourseName] = useState("");
  const [lessonName, setLessonName] = useState("");
  const [lessonCourse, setLessonCourse] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentLesson, setAssignmentLesson] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizLesson, setQuizLesson] = useState("");

  // Filter state for progress and quiz results
  const [filters, setFilters] = useState({
    studentName: "",
    course: "",
    lesson: "",
    quiz: "",
  });

  const deleteItem = (list, setList, id) => {
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id, type) => {
    // Here you can implement edit functionality, e.g., showing a modal or changing the state
    alert(`Editing ${type} with ID: ${id}`);
  };
  // Placeholder function to simulate fetching student progress and quiz results
  const fetchStudentProgress = async () => {
    const data = [
      {
        student: "John Doe",
        course: "Math",
        lesson: "Algebra",
        quiz: "Quiz 1",
        progress: "80%",
      },
      {
        student: "Jane Smith",
        course: "Science",
        lesson: "Physics",
        quiz: "Quiz 1",
        progress: "95%",
      },
      {
        student: "Mike Johnson",
        course: "Math",
        lesson: "Geometry",
        quiz: "Quiz 2",
        progress: "70%",
      },
    ];
    setStudentProgress(data);
  };

  const fetchTestReports = async () => {
    const reports = [
      { student: "John Doe", quiz: "Quiz 1", score: "85%" },
      { student: "Jane Smith", quiz: "Quiz 1", score: "90%" },
      { student: "Mike Johnson", quiz: "Quiz 2", score: "75%" },
    ];
    setTestReports(reports);
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchStudentProgress();
    fetchTestReports();
  }, []);

  // Filter the progress and quiz reports based on applied filters
  const filteredProgress = studentProgress.filter((progress) => {
    return (
      (filters.studentName === "" ||
        progress.student
          .toLowerCase()
          .includes(filters.studentName.toLowerCase())) &&
      (filters.course === "" ||
        progress.course.toLowerCase().includes(filters.course.toLowerCase())) &&
      (filters.lesson === "" ||
        progress.lesson.toLowerCase().includes(filters.lesson.toLowerCase())) &&
      (filters.quiz === "" ||
        progress.quiz.toLowerCase().includes(filters.quiz.toLowerCase()))
    );
  });

  const filteredTestReports = testReports.filter((report) => {
    return (
      (filters.studentName === "" ||
        report.student
          .toLowerCase()
          .includes(filters.studentName.toLowerCase())) &&
      (filters.quiz === "" ||
        report.quiz.toLowerCase().includes(filters.quiz.toLowerCase()))
    );
  });

  const addCourse = () => {
    if (courseName.trim()) {
      setCourses([...courses, { id: courses.length + 1, name: courseName }]);
      setCourseName("");
    }
  };

  const addLesson = () => {
    if (lessonName.trim() && lessonCourse) {
      setLessons([
        ...lessons,
        { id: lessons.length + 1, name: lessonName, course: lessonCourse },
      ]);
      setLessonName("");
      setLessonCourse("");
    }
  };

  const addAssignment = () => {
    if (assignmentTitle.trim() && assignmentLesson) {
      setAssignments([
        ...assignments,
        {
          id: assignments.length + 1,
          title: assignmentTitle,
          lesson: assignmentLesson,
        },
      ]);
      setAssignmentTitle("");
      setAssignmentLesson("");
    }
  };

  const addQuiz = () => {
    if (quizTitle.trim() && quizLesson) {
      setQuizzes([
        ...quizzes,
        { id: quizzes.length + 1, title: quizTitle, lesson: quizLesson },
      ]);
      setQuizTitle("");
      setQuizLesson("");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Admin Dashboard</h1>

      {/* Add Course, Lesson, Assignment, Quiz Sections */}
      <div className="admin-sections">
        <div className="admin-card">
          <h2>Add Course</h2>
          <input
            type="text"
            placeholder="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
          <button onClick={addCourse}>Add Course</button>
        </div>
        <div className="admin-card">
          <h2>Add Lesson</h2>
          <input
            type="text"
            placeholder="Lesson Name"
            value={lessonName}
            onChange={(e) => setLessonName(e.target.value)}
          />
          <select
            value={lessonCourse}
            onChange={(e) => setLessonCourse(e.target.value)}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.name}>
                {course.name}
              </option>
            ))}
          </select>
          <button onClick={addLesson}>Add Lesson</button>
        </div>
        <div className="admin-card">
          <h2>Generate Assignment</h2>
          <input
            type="text"
            placeholder="Assignment Title"
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
          />
          <select
            value={assignmentLesson}
            onChange={(e) => setAssignmentLesson(e.target.value)}
          >
            <option value="">Select Lesson</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.name}>
                {lesson.name}
              </option>
            ))}
          </select>
          <button onClick={addAssignment}>Generate Assignment</button>
        </div>
        <div className="admin-card">
          <h2>Generate Quiz</h2>
          <input
            type="text"
            placeholder="Quiz Title"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />
          <select
            value={quizLesson}
            onChange={(e) => setQuizLesson(e.target.value)}
          >
            <option value="">Select Lesson</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.name}>
                {lesson.name}
              </option>
            ))}
          </select>
          <button onClick={addQuiz}>Generate Quiz</button>
        </div>
      </div>

      {/* Data Tables for courses, lessons, assignments, quizzes */}

      <div className="admin-table-container">
        {[
          { title: "Courses", list: courses, setList: setCourses },
          { title: "Lessons", list: lessons, setList: setLessons },
          { title: "Assignments", list: assignments, setList: setAssignments },
          { title: "Quizzes", list: quizzes, setList: setQuizzes },
        ].map((section) => (
          <div className="admin-table-card" key={section.title}>
            <h3>{section.title}</h3>
            <ul>
              {section.list.map((item) => (
                <li key={item.id} className="list-item">
                  <span>
                    {item.name || item.title} ({item.course || item.lesson})
                  </span>
                  <div className="button-container">
                    <button
                      className="edit-btn"
                      onClick={() => editItem(item.id, section.title)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteItem(section.list, section.setList, item.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <h2>Filter Student Progress</h2>
        <input
          type="text"
          name="studentName"
          placeholder="Search by Student Name"
          value={filters.studentName}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="course"
          placeholder="Search by Course"
          value={filters.course}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="lesson"
          placeholder="Search by Lesson"
          value={filters.lesson}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="quiz"
          placeholder="Search by Quiz"
          value={filters.quiz}
          onChange={handleFilterChange}
        />
      </div>

      {/* Student Progress Table */}
      <div className="admin-table">
        <h2>Student Progress</h2>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Lesson</th>
              <th>Quiz</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {filteredProgress.map((progress, index) => (
              <tr key={index}>
                <td>{progress.student}</td>
                <td>{progress.course}</td>
                <td>{progress.lesson}</td>
                <td>{progress.quiz}</td>
                <td>{progress.progress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Test Reports Table */}
      <div className="admin-table">
        <h2>Test Reports</h2>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Quiz</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredTestReports.map((report, index) => (
              <tr key={index}>
                <td>{report.student}</td>
                <td>{report.quiz}</td>
                <td>{report.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
