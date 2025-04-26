import { Router } from "express";
import { loginUser,registerUser,logout,refreshAccessToken,updateUserProfile,forgetPassword, getUserProfile } from "../controllers/userController.js";
import { verifyJWT,verifyAdminJWT } from "../middlewares/auth.middleware.js";
import { adminLogin, adminLogout, createAssignment, createCourse, createLesson, createQuiz, deleteAssignment, deleteCourse, deleteLesson, deleteQuiz, getAllAssignments, getAllCourses, getAllLessons, getAllQuizes, getAllUsers, getAssignmentId, getAssignmenttitle, getCourseId, getCourseIdfromLId, getCourseName, getLessonId, getQuizId, getQuizName, refreshAdminAccessToken, updateAssignment, updateCourse, updateLesson, updateQuiz } from "../controllers/adminController.js";
import {generateQuizController, getQuizController, getQuizData} from "../controllers/quizController.js";
import { getquizPercentage, saveStudentQuizResultController, updateDifficultyController, updateStudentCourseResultController } from "../controllers/studentResultController.js";
import { updateStudentCourseResult } from "../services/updateStudentCourseResultService.js";
import { evaluateAssignmentController, generateAssignmentForStudent, getAssignmentController, getAssignmentScore, submitAssignmentController } from "../controllers/assignmentController.js";
import { saveStudentAssignmentSubmission } from "../services/Assignment.service.js";
const router = Router();

router.get('/verify', verifyJWT, (req, res, next) => {
  // If user token is valid, send a response with user data
  if (req.user) {
    return res.status(200).json({ message: 'User access granted', user: req.user });
  }
  // If user verification fails, move to the next middleware for admin verification
 },
  (err, req, res, next) => {
  // Catch any errors and return unauthorized if both verifications fail
  return res.status(401).json({ message: 'Access denied. Invalid token or role' });
});
router.get('/verifyadmin', verifyAdminJWT, (req, res, next) => {
  // If user token is valid, send a response with user data
  if (req.user) {
    return res.status(200).json({ message: 'Admin access granted', user: req.user });
  }
  // If user verification fails, move to the next middleware for admin verification
 },
  (err, req, res, next) => {
  // Catch any errors and return unauthorized if both verifications fail
  return res.status(401).json({ message: 'Access denied. Invalid token or role' });
});


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logout)
router.route("/updateprofile").post(verifyJWT,updateUserProfile)
router.route("/getuserdetails").get(verifyJWT,getUserProfile)
router.route("/getusers").get(getAllUsers)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/forgetpassword").post(forgetPassword)
router.route("/adminlogin").post(adminLogin)
router.route("/adminlogout").post(verifyAdminJWT,adminLogout)
router.route("/refresh-admintoken").post(refreshAdminAccessToken)
router.route("/addcourse").post(verifyAdminJWT,createCourse)
router.route("/getcourses").post(getAllCourses)
router.route("/getcourseid").post(verifyAdminJWT,getCourseId)
router.route("/getcoursename").post(verifyAdminJWT,getCourseName)
router.route("/getcoursesName").post(getCourseName)
router.route("/getcourseidfromlid").post(getCourseIdfromLId)
router.route("/updatecourse").post(verifyAdminJWT,updateCourse)
router.route("/deletecourse").post(verifyAdminJWT,deleteCourse)
router.route("/addlesson").post(verifyAdminJWT,createLesson)
router.route("/getlessons").post(getAllLessons)
router.route("/getlessonid").post(verifyAdminJWT,getLessonId)
router.route("/updatelesson").post(verifyAdminJWT,updateLesson)
router.route("/deletelesson").post(verifyAdminJWT,deleteLesson)
router.route("/addassignment").post(verifyAdminJWT,createAssignment)
router.route("/getassignments").post(getAllAssignments)
router.route("/getassignmnetid").post(verifyAdminJWT,getAssignmentId)
router.route("/updateassignment").post(verifyAdminJWT,updateAssignment)
router.route("/deleteassignment").post(verifyAdminJWT,deleteAssignment)
router.route("/addquiz").post(verifyAdminJWT,createQuiz)
router.route("/getquizes").post(getAllQuizes)
router.route("/getquizid").post(verifyAdminJWT,getQuizId)
router.route("/getquiztitle").post(getQuizName)
router.route("/getassignmenttitle").post(getAssignmenttitle)
router.route("/updatequiz").post(verifyAdminJWT,updateQuiz)
router.route("/deletequiz").post(verifyAdminJWT,deleteQuiz)
router.route("/getcid").post(verifyAdminJWT,getCourseIdfromLId)
router.post('/generateQuiz', verifyJWT,generateQuizController); // Route to generate a quiz based on lessonId
router.post('/save-result', verifyJWT, saveStudentQuizResultController); // Route to save student's quiz result
router.route("/getquiz").post(verifyJWT,getQuizController);
router.route("/getquizresult").post(verifyJWT,getquizPercentage);
router.route("/getquizdata").post(getQuizData);
router.route("/getassignmentscore").post(verifyJWT,getAssignmentScore);
router.route("/update-result").post(updateStudentCourseResultController);  
router.post('/update-difficulty', verifyJWT,updateDifficultyController); // Route to update the difficulty level of a student based on their performance
router.post("/evaluate-assignment",verifyJWT, evaluateAssignmentController); // Route to evaluate an assignment using Groq API
router.post("/update-student-course-result", updateStudentCourseResult); // Route to update student course result based on their performance
router.post("/generate-assignment-for-student", verifyJWT,generateAssignmentForStudent); // Route to generate an assignment for a student using Groq API
router.post("/get-assignment", getAssignmentController); // Route to get assignment details for a student using Groq API
router.post("/submit-assignment-result", verifyJWT,submitAssignmentController); // Route to save student's assignment result
export default router;