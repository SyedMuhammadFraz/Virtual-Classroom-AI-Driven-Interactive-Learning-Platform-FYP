import { Router } from "express";
import { loginUser,registerUser,logout,refreshAccessToken,updateUserProfile,forgetPassword } from "../controllers/userController.js";
import { verifyJWT,verifyAdminJWT } from "../middlewares/auth.middleware.js";
import { adminLogin, adminLogout, createAssignment, createCourse, createLesson, createQuiz, deleteAssignment, deleteCourse, deleteLesson, deleteQuiz, getAllAssignments, getAllCourses, getAllLessons, getAllQuizes, getAssignmentId, getCourseId, getLessonId, getQuizId, refreshAdminAccessToken, updateAssignment, updateCourse, updateLesson, updateQuiz } from "../controllers/adminController.js";
const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logout)
router.route("/updateprofile").post(verifyJWT,updateUserProfile)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/forgetpassword").post(forgetPassword)
router.route("/adminlogin").post(adminLogin)
router.route("/adminlogout").post(verifyAdminJWT,adminLogout)
router.route("/refresh-admintoken").post(refreshAdminAccessToken)
router.route("/addcourse").post(verifyAdminJWT,createCourse)
router.route("/getcourses").post(verifyAdminJWT,getAllCourses)
router.route("/getcourseid").post(verifyAdminJWT,getCourseId)
router.route("/updatecourse").post(verifyAdminJWT,updateCourse)
router.route("/deletecourse").post(verifyAdminJWT,deleteCourse)
router.route("/addlesson").post(verifyAdminJWT,createLesson)
router.route("/getlessons").post(verifyAdminJWT,getAllLessons)
router.route("/getlessonid").post(verifyAdminJWT,getLessonId)
router.route("/updatelesson").post(verifyAdminJWT,updateLesson)
router.route("/deletelesson").post(verifyAdminJWT,deleteLesson)
router.route("/addassignment").post(verifyAdminJWT,createAssignment)
router.route("/getassignments").post(verifyAdminJWT,getAllAssignments)
router.route("/getassignmnetid").post(verifyAdminJWT,getAssignmentId)
router.route("/updateassignment").post(verifyAdminJWT,updateAssignment)
router.route("/deleteassignment").post(verifyAdminJWT,deleteAssignment)
router.route("/addquiz").post(verifyAdminJWT,createQuiz)
router.route("/getquizes").post(verifyAdminJWT,getAllQuizes)
router.route("/getquizid").post(verifyAdminJWT,getQuizId)
router.route("/updatequiz").post(verifyAdminJWT,updateQuiz)
router.route("/deletequiz").post(verifyAdminJWT,deleteQuiz)
export default router