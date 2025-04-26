import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/admin-dashboard.css";
import axios from 'axios';
import { toast } from 'react-toastify'
import ConfirmationModal from "../modals/confirmation-modal";
import { HandleLogout } from "./sidebar";
const AdminDashboard = () => {

  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);
  const [testReports, setTestReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseId, setCourseID] = useState("");
  const [lessonId, setLessonID] = useState("");

  const [lessonName, setLessonName] = useState("");
  const [lessonCourse, setLessonCourse] = useState("");
  const [assignmentId, setAssignmentID] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [assignmentLesson, setAssignmentLesson] = useState("");
  const [quizId, setQuizID] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizLesson, setQuizLesson] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Filter state for progress and quiz results
  const [filters, setFilters] = useState({
    studentName: "",
    course: "",
    lesson: "",
    quiz: "",
  });

  const deleteItem = async (list, setList, id, title) => {

    if (title == "Courses") {

      const itemToDelete = list.find((item) => item.id === id);
      const name = itemToDelete.name;
      try {

        const response = await axios.post(
          "http://localhost:5000/api/v1/users/deletecourse",
          { name },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
          }
        );
        console.log(response);
        setList(list.filter((item) => item.id !== id));
        console.log("Course Deleted successfully:", response.data);
        toast.success("Course Deleted Successfully!");
      } catch (error) {

        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message); // Show backend error message
        } else {
          toast.error("Error deleting Course. Please try again."); // Generic error message
        }
        console.error("Error in deleting the course");
      }
    }
    if (title == "Lessons") {

      const itemToDelete = list.find((item) => item.id === id);
      const title = itemToDelete.name;
      try {

        const response = await axios.post(
          "http://localhost:5000/api/v1/users/deletelesson",
          { title },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
          }
        );
        console.log(response);
        setList(list.filter((item) => item.id !== id));
        console.log("Lesson Deleted successfully:", response.data);
        toast.success("Lesson Deleted Successfully!");
      } catch (error) {

        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message); // Show backend error message
        } else {
          toast.error("Error deleting Lesson. Please try again."); // Generic error message
        }
        console.error("Error in deleting the Lesson");
      }
    }
    if (title == "Quizzes") {

      const itemToDelete = list.find((item) => item.id === id);
      const title = itemToDelete.title;
      try {

        const response = await axios.post(
          "http://localhost:5000/api/v1/users/deletequiz",
          { title },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
          }
        );
        console.log(response);
        setList(list.filter((item) => item.id !== id));
        console.log("Quiz Deleted successfully:", response.data);
        toast.success("Quiz Deleted Successfully!");
      } catch (error) {

        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message); // Show backend error message
        } else {
          toast.error("Error deleting Quiz. Please try again."); // Generic error message
        }
        console.error("Error in deleting the Quiz");
      }
    }
    if (title == "Assignments") {

      const itemToDelete = list.find((item) => item.id === id);
      const title = itemToDelete.title;
      try {

        const response = await axios.post(
          "http://localhost:5000/api/v1/users/deleteassignment",
          { title },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
          }
        );
        console.log(response);
        setList(list.filter((item) => item.id !== id));
        console.log("Assignment Deleted successfully:", response.data);
        toast.success("Assignment Deleted Successfully!");
      } catch (error) {

        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message); // Show backend error message
        } else {
          toast.error("Error deleting Quiz. Please try again."); // Generic error message
        }
        console.error("Error in deleting the Assignment");
      }
    }

  }
  // This will remove the item with the specified id from the list


  const editItem = async (id, type) => {
    // Here you can implement edit functionality, e.g., showing a modal or changing the state
    if (type === "Courses") {
      // Find the course by its ID
      const courseToEdit = courses.find(course => course.id === id);
      const oldname = courses.find(course => course.id === id)?.name;

      if (courseToEdit) {
        // Prompt the user to enter a new course name
        const name = window.prompt(`Enter the new course name for ${courseToEdit.name}:`);

        if (name) {
          // Create a copy of the courses array and update the course name

          try {

            const response = await axios.post(
              "http://localhost:5000/api/v1/users/updatecourse",
              { oldname, name },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
              }
            );
            console.log(response);

            const updatedCourses = courses.map(course =>
              course.id === id ? { ...course, name: name } : course
            );
            setCourses(updatedCourses);
            console.log(updatedCourses);
            console.log("Course Updated successfully:", response.data);
            toast.success("Course Name Updated Successfully!");
          }

          catch (error) {

            if (error.response && error.response.data && error.response.data.message) {
              toast.error(error.response.data.message); // Show backend error message
            } else {
              toast.error("Error adding Course. Please try again."); // Generic error message
            }
            console.error("Error in updating the course");
          }


        }
      }
    }
    else if (type == "Lessons") {

      const lessonToEdit = lessons.find(lesson => lesson.id === id);
      const oldtitle = lessons.find(lesson => lesson.id === id)?.name;
      if (lessonToEdit) {

        const title = window.prompt(`Enter the new Lesson name for ${lessonToEdit.name}:`);
        if (title) {

          try {

            const response = await axios.post(
              "http://localhost:5000/api/v1/users/updatelesson",
              { oldtitle, title },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
              }
            );
            console.log(response);

            const updatedLessons = lessons.map(lesson =>
              lesson.id === id ? { ...lesson, name: title } : lesson
            );
            setLessons(updatedLessons);
            console.log(updatedLessons);
            console.log("Lesson Updated successfully:", response.data);
            toast.success("Lesson Name Updated Successfully!");
          }

          catch (error) {

            if (error.response && error.response.data && error.response.data.message) {
              toast.error(error.response.data.message); // Show backend error message
            } else {
              toast.error("Error Updating Lesson. Please try again."); // Generic error message
            }
            console.error("Error in updating the lesson");
          }

        }
      }
    }
    else if (type == "Quizzes") {

      const quizToEdit = quizzes.find(quiz => quiz.id === id);
      const oldtitle = quizzes.find(quiz => quiz.id === id)?.title;
      if (quizToEdit) {

        const title = window.prompt(`Enter the new Quiz name for ${quizToEdit.title}:`);
        if (title) {

          try {

            const response = await axios.post(
              "http://localhost:5000/api/v1/users/updatequiz",
              { oldtitle, title },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
              }
            );
            console.log(response);

            const updatedquizes = quizzes.map(quiz =>
              quiz.id === id ? { ...quiz, title: title } : quiz
            );
            setQuizzes(updatedquizes);
            console.log(updatedquizes);
            console.log("Quiz Updated successfully:", response.data);
            toast.success("Quiz Name Updated Successfully!");
          }

          catch (error) {

            if (error.response && error.response.data && error.response.data.message) {
              toast.error(error.response.data.message); // Show backend error message
            } else {
              toast.error("Error Updating Lesson. Please try again."); // Generic error message
            }
            console.error("Error in updating the quiz");
          }

        }
      }
    }
    else if (type == "Assignments") {

      const assignmentToEdit = assignments.find(assignment => assignment.id === id);
      const oldtitle = assignments.find(assignment => assignment.id === id)?.title;
      console.log(oldtitle);
      if (assignmentToEdit) {

        const title = window.prompt(`Enter the new Assignment name for ${assignmentToEdit.title}:`);
        if (title) {

          try {

            const response = await axios.post(
              "http://localhost:5000/api/v1/users/updateassignment",
              { oldtitle, title },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
              }
            );
            console.log(response);

            const updatedassignments = assignments.map(assignment =>
              assignment.id === id ? { ...assignment, title: title } : assignment
            );
            setAssignments(updatedassignments);
            console.log(updatedassignments);
            console.log("Assignment Updated successfully:", response.data);
            toast.success("Assignment Name Updated Successfully!");
          }

          catch (error) {

            if (error.response && error.response.data && error.response.data.message) {
              toast.error(error.response.data.message); // Show backend error message
            } else {
              toast.error("Error Updating Assignment. Please try again."); // Generic error message
            }
            console.error("Error in updating the Assignment");
          }

        }
      }
    }
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

  const fetchAllCourses = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/getcourses",
        {}
      );

      // Log the full response to check the structure
      console.log(response);

      if (response.status === 200) {
        // Access courses directly as it is returned as an array
        if (response.data?.data) {
          setCourses(response.data.data.map(course => ({
            id: course.id,
            name: course.name,
            description: course.description
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

  const fetchAllLessons = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/getlessons",
        {}
      );

      // Log the full response to check the structure
      console.log(response);

      if (response.status === 200) {
        // Access courses directly as it is returned as an array
        if (response.data?.data) {
          setLessons(response.data.data.map(lesson => ({
            id: lesson.id,
            name: lesson.title,
            course: lesson.course_id
          })));
        } else {
          toast.error("No Lessons found.");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch Lessons.");
      console.error("Error fetching All Lessons:", error);
    }
  };
  const fetchAllQuizes = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/getquizes",
        {}
      );

      // Log the full response to check the structure
      console.log(response);

      if (response.status === 200) {
        // Access courses directly as it is returned as an array
        if (response.data?.data) {
          setQuizzes(response.data.data.map(quiz => ({
            id: quiz.id,
            title: quiz.title,
            lesson: quiz.lesson_id
          })));
        } else {
          toast.error("No Quizzes found.");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch Quizzes.");
      console.error("Error fetching All Quizes:", error);
    }
  };
  const fetchAllAssignments = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/getassignments",
        {}
      );

      // Log the full response to check the structure
      console.log(response);

      if (response.status === 200) {
        // Access courses directly as it is returned as an array
        if (response.data?.data) {
          setAssignments(response.data.data.map(assignment => ({
            id: assignment.id,
            title: assignment.title,
            description: assignment.description,
            lesson: assignment.lesson_id
          })));
        } else {
          toast.error("No Assignments found.");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch Assignments.");
      console.error("Error fetching All Assignments:", error);
    }
  };
  // Fetch data when the component mounts
  useEffect(() => {
    fetchStudentProgress();
    fetchTestReports();
    fetchAllCourses();
    fetchAllLessons();
    fetchAllQuizes();
    fetchAllAssignments();
    loadTestReports();
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
  const addCourse = async () => {

    if (courseName.trim() && courseDescription.trim()) {

      const newCourses = [...courses, { id: courseId, name: courseName, description: courseDescription }];
      setCourses(newCourses);
      try {
        // Send the courseName and courseDescription to the API
        const response = await axios.post(
          "http://localhost:5000/api/v1/users/addcourse",  // Change the endpoint if needed
          {
            name: courseName,
            description: courseDescription
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Send token in Authorization header
            }
          }
        );



        setCourseName("");
        setCourseDescription("");
        setCourseID("")
        console.log("Course added successfully:", response.data);
        toast.success("Course Added Successfully!");
      }

      // Handle the response if needed
      catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message); // Show backend error message
        } else {
          toast.error("Error adding Course. Please try again."); // Generic error message
        }
        console.error("Error Adding Course", error);
      }
    }

  };

  const addLesson = async () => {

    let cId = "";
    if (lessonName.trim() && lessonCourse) {

      try {

        const response = await axios.post(
          "http://localhost:5000/api/v1/users/getcourseid",  // Change the endpoint if needed
          {
            name: lessonCourse,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Send token in Authorization header
            }
          }
        );
        cId = response.data.data;
      } catch (error) {

        console.error("Error in fetching the id", error.message);
      }

      try {

        const response = await axios.post(
          "http://localhost:5000/api/v1/users/addlesson",
          {
            course_id: cId,
            title: lessonName,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Send token in Authorization header
            }
          }
        );

        
        setLessons([
          ...lessons,
          { id: lessonId, name: lessonName, course: lessonCourse },
        ]);
        setLessonID("");
        setLessonName("");
        setLessonCourse("");
        console.log("Lesson added successfully:", response.data);
        toast.success("Lesson Added Successfully!");
      } catch (error) {

        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message); // Show backend error message
        } else {
          toast.error("Error adding Lesson. Please try again."); // Generic error message
        }
        console.error("Error in adding the lesson", error.message);
      }

    }
  };

  const addAssignment = async () => {
    if (assignmentTitle.trim() && assignmentDescription.trim() && assignmentLesson) {

      let lId = "";
      let cId = "";

      try {

        const response = await axios.post(
          "http://localhost:5000/api/v1/users/getlessonid",  // Change the endpoint if needed
          {
            title: assignmentLesson,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Send token in Authorization header
            }
          }
        );
        lId = response.data.data;
      } catch (error) {

        console.error("Error in fetching the id", error.message)
      }

       
      try {

        let dueDate = ""; // This comes from user input
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dueDate = tomorrow.toISOString().split("T")[0]; // Format as YYYY-MM-DD
        const response = await axios.post(
          "http://localhost:5000/api/v1/users/addassignment",
          {
            
            lesson_id: lId,
            title: assignmentTitle,
            description: assignmentDescription,
            due_date: dueDate
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Send token in Authorization header
            }
          }
        );


        setAssignments([
          ...assignments,
          {
            id: assignmentId,
            title: assignmentTitle,
            description: assignmentDescription,
            lesson: assignmentLesson,
          },
        ]);
        setAssignmentID("");
        setAssignmentTitle("");
        setAssignmentLesson("");
        setAssignmentDescription("")
        console.log("Assignment added successfully:", response.data);
        toast.success("Assignment Added Successfully!");
      } catch (error) {

        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message); // Show backend error message
        } else {
          toast.error("Error adding Lesson. Please try again."); // Generic error message
        }
        console.error("Error in adding the lesson", error.message);
      }

    }
  };

  const addQuiz = async () => {
    if (quizTitle.trim() && quizLesson) {

      let lId = "";

      try {

        const response = await axios.post(
          "http://localhost:5000/api/v1/users/getlessonid",  // Change the endpoint if needed
          {
            title: quizLesson,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Send token in Authorization header
            }
          }
        );
        lId = response.data.data;

      } catch (error) {

        console.error("Error in fetching the id", error.message)


      }
      try {


        const response = await axios.post(
          "http://localhost:5000/api/v1/users/addquiz",
          {
            lesson_id: lId,
            title: quizTitle,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Send token in Authorization header
            }
          }
        );


        setQuizzes([
          ...quizzes,
          { id: quizId, title: quizTitle, lesson: quizLesson },
        ]);
        setQuizID("");
        setQuizTitle("");
        setQuizLesson("");
        console.log("Quiz added successfully:", response.data);
        toast.success("Quiz Added Successfully!");

      } catch (error) {

        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message); // Show backend error message
        } else {
          toast.error("Error adding Quiz. Please try again."); // Generic error message
        }
        console.error("Error in adding the Quiz", error.message);
      }

    };
  }
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
// Fetch user profile (student details)
  const fetchUserProfile = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/v1/users/getusers');
    
    return response.data.data;  // Assuming 'data' contains user details like fullname
  } catch (error) {
    console.error("Error fetching user profile", error);
    return null;
  }
};
  const fetchQuizData = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/users/getquizdata');
       
    return response.data.data;  // Assuming 'data' contains the quiz data array
  } catch (error) {
    console.error("Error fetching quiz data", error);
    return [];
  }
};
const fetchQuizName = async (quizTemplateId) => {
  try {
    const response = await axios.post("http://localhost:5000/api/v1/users/getquiztitle", { id: quizTemplateId });
    return response.data.data; // Assuming quizTitle is the key for quiz name
  } catch (error) {
    console.error("Error fetching quiz title", error);
    return "Unknown Quiz";
  }
};
const loadTestReports = async () => {
  try {
    const quizData = await fetchQuizData();
    const userProfiles = await fetchUserProfile();  // Note: it's an array!

    const enrichedTestReports = await Promise.all(
      quizData.map(async (report) => {
        const quizName = await fetchQuizName(report.quiz_template_id);
        // Find the correct user based on student_id
        const user = userProfiles[report.student_id - 1];  // VERY BASIC assumption if IDs are sequential
        // OR safer way: find by index
        // const user = userProfiles.find(u => u.id === report.student_id);

        return {
          student: user ? user.fullname : "Unknown Student",
          quiz: quizName,
          score: report.total_score_percentage,
        };
      })
    );

    setTestReports(enrichedTestReports);
  } catch (error) {
    console.error("Error loading test reports", error);
  } finally {
    setLoading(false);
  }
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
          <input
            type="text"
            placeholder="Course Description"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
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
          <input
            type="text"
            placeholder="Assignment Description"
            value={assignmentDescription}
            onChange={(e) => setAssignmentDescription(e.target.value)}
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
                  <span>{item.name || item.title} ({item.course || item.lesson})</span>
                  <div className="button-container">
                    <button className="edit-btn" onClick={() => editItem(item.id, section.title)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => deleteItem(section.list, section.setList, item.id, section.title)}>
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
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Quiz</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {testReports.map((report, index) => (
              <tr key={index}>
                <td>{report.student}</td>
                <td>{report.quiz}</td>
                <td>{report.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
      <div className="logout-container">
        <button className="logout-btn" onClick={() => setShowModal(true)}>Log Out</button>
      </div>
      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to log out?"
          onConfirm={() => HandleLogout(navigate)} 
          onCancel={() => setShowModal(false)}
        />
      )}
      
    </div>
  );
};

export default AdminDashboard;
