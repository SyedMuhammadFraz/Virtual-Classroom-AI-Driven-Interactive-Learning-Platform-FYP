import { Router } from "express";
import { loginUser,registerUser,logout,refreshAccessToken,updateUserProfile,forgetPassword, getUserProfile } from "../controllers/userController.js";
import { verifyJWT,verifyAdminJWT } from "../middlewares/auth.middleware.js";
import { adminLogin, adminLogout, createAssignment, createCourse, createLesson, createQuiz, deleteAssignment, deleteCourse, deleteLesson, deleteQuiz, getAllAssignments, getAllCourses, getAllLessons, getAllQuizes, getAssignmentId, getCourseId, getCourseIdfromLId, getLessonId, getQuizId, refreshAdminAccessToken, updateAssignment, updateCourse, updateLesson, updateQuiz } from "../controllers/adminController.js";
import {generateQuizController, getQuizController} from "../controllers/quizController.js";
import { saveStudentQuizResultController, updateDifficultyController, updateStudentCourseResultController } from "../controllers/studentResultController.js";
import { updateStudentCourseResult } from "../services/updateStudentCourseResultService.js";
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
router.route("/refresh-token").post(refreshAccessToken)
router.route("/forgetpassword").post(forgetPassword)
router.route("/adminlogin").post(adminLogin)
router.route("/adminlogout").post(verifyAdminJWT,adminLogout)
router.route("/refresh-admintoken").post(refreshAdminAccessToken)
router.route("/addcourse").post(verifyAdminJWT,createCourse)
router.route("/getcourses").post(getAllCourses)
router.route("/getcourseid").post(verifyAdminJWT,getCourseId)
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
router.route("/updatequiz").post(verifyAdminJWT,updateQuiz)
router.route("/deletequiz").post(verifyAdminJWT,deleteQuiz)
router.route("/getcid").post(verifyAdminJWT,getCourseIdfromLId)
router.post('/generateQuiz', generateQuizController); // Route to generate a quiz based on lessonId
router.post('/save-result', saveStudentQuizResultController); // Route to save student's quiz result
router.route("/getquiz").post(getQuizController);
router.route("/update-result").post(updateStudentCourseResultController);  
router.post('/update-difficulty', updateDifficultyController); // Route to update the difficulty level of a student based on their performance
export default router;