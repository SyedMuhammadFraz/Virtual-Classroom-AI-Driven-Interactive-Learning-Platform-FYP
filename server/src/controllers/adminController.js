import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { ADMIN_EMAIL,ADMIN_PASSWORD } from "../constants.js";
import {Course,Lesson,Assignment,Quiz} from "../models/adminModel.js"; 

import jwt from "jsonwebtoken";

// admin Credentials

 const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if(!(email || password)){

        throw new apiError(401,"All credentials are required");
    }
    // Check if the email and password match the hardcoded admin credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      throw new apiError(401, "Invalid email or password");
    }
  
    // Generate JWT for admin login
    const accessToken = jwt.sign({ email: email , role : "admin"}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
    const refreshToken = jwt.sign({ email: email, role : "admin" }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  
    // Set the cookies for the tokens
    const options = {
      httpOnly: true,
      secure: true, // Use secure cookies in production
    };
  
    // Send the tokens in cookies and respond
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new apiResponse(200, { accessToken, refreshToken }, "Admin logged in successfully"));
  });
   const adminLogout = asyncHandler(async (req, res) => {
    return res
      .status(200)
      .clearCookie("accessToken", { httpOnly: true, secure: true })
      .clearCookie("refreshToken", { httpOnly: true, secure: true })
      .json(new apiResponse(200, "Admin logged out successfully"));
  });
  
  const refreshAdminAccessToken = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!refreshToken) {
      throw new apiError(401, "Access denied. No refresh token provided");
    }

    // Verify refresh token
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Ensure the token belongs to the admin
    if (decodedToken.role !== "admin" || decodedToken.email !== ADMIN_EMAIL) {
      throw new apiError(403, "Access denied. Admin only");
    }

    // Generate a new access token
    const newAccessToken =  jwt.sign(
      { email: decodedToken.email, role: "admin" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const newRefreshToken =  jwt.sign(
        { email: decodedToken.email, role: "admin" },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

    // Send the new access token as a cookie and response
    return res
      .status(200)
      .cookie("accessToken", newAccessToken, { httpOnly: true, secure: true })
      .cookie("refreshtoken",newRefreshToken,{ httpOnly: true, secure: true })
      .json(new apiResponse(200, { accessToken: newAccessToken }, "Access token refreshed successfully"));
  } catch (error) {
    throw new apiError(401,   "Invalid refresh token");
  }
});

// CRUD For Courses
  const createCourse = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
  
    if (!name || !description) {
      throw new apiError(400, "Course name and description are required");
    }
    const existingCourse = await Course.findOne({ where: { name } });
    if (existingCourse) {
      throw new apiError(400,"Course of this name already Exists");
    }
    const newCourse = await Course.create({ name, description });
    const createdCourse = await Course.findOne({
        where: { name: newCourse.name },  
      });
      if(!createdCourse){
        console.log("Course Creation Failed")
        throw new apiError(400,"Error in adding the course")
      }
    return res
      .status(201)
      .json(new apiResponse(200, createCourse, "Course created successfully"));
  });
    const getAllCourses = asyncHandler(async (req, res) => {
    const courses = await Course.findAll({ order: [["created_at", "ASC"]] });
  
    return res
      .status(200)
      .json(new apiResponse(200, courses, "Courses fetched successfully"));
  });
  const getCourseId = asyncHandler(async (req, res) => {

    const { name } = req.body;
    if(!(name)){

        throw new apiError(401,"Course Name is Required")
    }
    const existingCourse = await Course.findOne({ where: { name } });
    if(!existingCourse){

        throw new apiError(401,"Course Not Found")
    }

    return res
      .status(200)
      .json(new apiResponse(200, existingCourse.id, "Course ID fetched successfully"));
  });
  
  const getCourseIdfromLId = asyncHandler(async (req, res) => {

    const { id } = req.body;
    if(!(id)){

        throw new apiError(401,"Lesson ID is Required")
    }
    const existingCourse = await Lesson.findOne({ where: { id } });
    if(!existingCourse){

        throw new apiError(401,"Course Not Found")
    }

    return res
      .status(200)
      .json(new apiResponse(200, existingCourse.course_id, "Course ID fetched successfully"));
  });
   const updateCourse = asyncHandler(async (req, res) => {

    const { oldname,name } = req.body;
     
    if(!(oldname,name)){

        throw new apiError(401,"All fields are required")
    }
    const course = await Course.findOne({
        where: {
          name: oldname 
        }
      });
      
     if(!course){

        throw new apiError(401,"Course not Found")
     }
    
    course.name = name ;
  
    await course.save();
  
    return res
      .status(200)
      .json(new apiResponse(200, course, "Course updated successfully"));
  });


   const deleteCourse = asyncHandler(async (req, res) => {
    
    const { name } = req.body;
    if(!name){

        throw new apiError(404, "All fields are required");
    }
    const course = await Course.findOne({
        where: {
          name: name 
        }
      });
    if (!course) {
      throw new apiError(404, "Course not found");
    }
    await course.destroy();

  return res
    .status(200)
    .json(new apiResponse(200, null, "Course deleted successfully"));
});
  
// CRUD For Lessons

 const createLesson = asyncHandler(async (req, res) => {
    const { course_id, title, content } = req.body;
    
    if (!course_id || !title) {
      throw new apiError(400, "Course ID OR title are required");
    }
    const course = await Course.findOne({
        where: {
          id: course_id
        }
      });
    if(!course){

        throw new apiError(401,"Course with Id dont Exist.")
    }
    const existingLesson = await Lesson.findOne({ where: { title } });
    if (existingLesson) {
      throw new apiError("Lesson of this name already exists");
    }
    const lesson = await Lesson.create({
      course_id,
      title,
      content,  // content is optional
    });
    const createdLesson = await Lesson.findOne({
        where: { title: lesson.title },  
      });
      if(!createdLesson){

        console.log("Lesson Creation Failed")
        throw new apiError(400,"Error in adding the Lesson")
      }
    return res.status(201).json(new apiResponse(201, createdLesson, "Lesson created successfully"));
  });
  const updateLesson = asyncHandler(async (req, res) => {

    const { oldtitle,title } = req.body;
    if(!(oldtitle , title)){

        throw new apiError(401,"Lesson with old and new title are required")
    }
    const lesson = await Lesson.findOne({
        where: {
          title: oldtitle
        }
      });
      
     if(!lesson){

        throw new apiError(401,"Lesson not Found")
     }
  
    lesson.title = title ;
  
    await lesson.save();

    return res
      .status(200)
      .json(new apiResponse(200, lesson, "Lesson updated successfully"));
  });
  const getAllLessons = asyncHandler(async (req, res) => {
    const lessons = await Lesson.findAll({ order: [["created_at", "ASC"]] });
  
    return res
      .status(200)
      .json(new apiResponse(200, lessons, "Lessons fetched successfully"));
  });
  const getLessonId = asyncHandler(async (req, res) => {

    const { title } = req.body;
    if(!(title)){

        throw new apiError(401,"Lesson Name is Required")
    }
    const existingLesson = await Lesson.findOne({ where: { title } });
    if(!existingLesson){

        throw new apiError(401,"Lesson Not Found")
    }

    return res
      .status(200)
      .json(new apiResponse(200, existingLesson.id, "Lesson ID fetched successfully"));
  });

  const deleteLesson = asyncHandler(async (req, res) => {
    
    const { title } = req.body;
    
    if(!title){
        throw new apiError(401,"All fields are required")
    }
    const lesson = await Lesson.findOne({
        where: {
          title: title
        }
      });
    if (!lesson) {
      throw new apiError(404, "Lesson not found");
    }
    await lesson.destroy();

  return res
    .status(200)
    .json(new apiResponse(200, null, "Lesson deleted successfully"));
});
  
// Assignments Section 

const createAssignment = asyncHandler(async (req, res) => {
    const { course_id, lesson_id, title, description, due_date } = req.body;
    
    if (!course_id || !lesson_id || !title || !due_date) {
      throw new apiError(400, "Course ID, Lesson ID, Title, and Due Date are required");
    }
    const course = await Course.findOne({
        where: {
          id: course_id
        }
      });
    if(!course){

        throw new apiError(401,"Course with this Id dont Exist.")
    }
    const lesson = await Lesson.findOne({
        where: {
          id: lesson_id
        }
      });
    if(!lesson){

        throw new apiError(401,"Lesson with this Id dont Exist.")
    }
    const existingAssignment = await Assignment.findOne({ where: { title } });
    if (existingAssignment) {
      throw new apiError("Assignment of this name already generated");
    }
    const assignment = await Assignment.create({
      course_id,
      lesson_id,
      title,
      description,
      due_date,
    });
  
    return res.status(201).json(new apiResponse(201, assignment, "Assignment created successfully"));
  });

  const getAllAssignments = asyncHandler(async (req, res) => {
    const assignments = await Assignment.findAll({ order: [["created_at", "ASC"]] });
  
    return res
      .status(200)
      .json(new apiResponse(200, assignments, "Assignments fetched successfully"));
  });
  const getAssignmentId = asyncHandler(async (req, res) => {

    const { title } = req.body;
    if(!(title)){

        throw new apiError(401,"Assignment Name is Required")
    }
    const existingAssignment = await Assignment.findOne({ where: { title } });
    if(!existingAssignment){

        throw new apiError(401,"Assignment Not Found")
    }

    return res
      .status(200)
      .json(new apiResponse(200, existingAssignment.id, "Assignment ID fetched successfully"));
  });
  const updateAssignment = asyncHandler(async (req, res) => {

    const { oldtitle,title } = req.body;
    if(!(oldtitle , title)){

        throw new apiError(401,"Assignment with old and new title are required")
    }
    const assignment = await Assignment.findOne({
        where: {
          title: oldtitle
        }
      });
      
     if(!assignment){

        throw new apiError(401,"Assignment not Found")
     }
  
    assignment.title = title ;
  
    await assignment.save();

    return res
      .status(200)
      .json(new apiResponse(200, assignment, "Assignment updated successfully"));
  });
  const deleteAssignment = asyncHandler(async (req, res) => {
    
    const { title } = req.body;
    
    if(!title){
        throw new apiError(401,"All fields are required")
    }
    const assignment = await Assignment.findOne({
        where: {
          title: title
        }
      });
    if (!assignment) {
      throw new apiError(404, "Assignment not found");
    }
    await assignment.destroy();

  return res
    .status(200)
    .json(new apiResponse(200, null, "Assignment deleted successfully"));
});


// Quizes Section

const createQuiz = asyncHandler(async (req, res) => {
    const {  lesson_id, title} = req.body;
    
    if ( !lesson_id || !title) {
      throw new apiError(400, " Lesson ID, Title are required");
    }
    const lesson = await Lesson.findOne({
        where: {
          id: lesson_id
        }
      });
    if(!lesson){

        throw new apiError(401,"Lesson with this Id dont Exist.")
    }
    const existingQuiz = await Quiz.findOne({ where: { title } });
    if (existingQuiz) {
      throw new apiError(400,"Quiz of this name already generated");
    }
    const quiz = await Quiz.create({
      lesson_id,
      title,
    });
  
    return res.status(201).json(new apiResponse(201, quiz, "Quiz created successfully"));
  });

  const getAllQuizes = asyncHandler(async (req, res) => {
    const quizes= await Quiz.findAll({ order: [["created_at", "ASC"]] });
  
    return res
      .status(200)
      .json(new apiResponse(200, quizes, "Quizes fetched successfully"));
  });
  const getQuizId = asyncHandler(async (req, res) => {

    const { title } = req.body;
    if(!(title)){

        throw new apiError(401,"Quiz Name is Required")
    }
    const existingQuiz = await Quiz.findOne({ where: { title } });
    if(!existingQuiz){

        throw new apiError(401,"Quiz Not Found")
    }

    return res
      .status(200)
      .json(new apiResponse(200, existingQuiz.id, "Quiz ID fetched successfully"));
  });
  const updateQuiz = asyncHandler(async (req, res) => {

    const { oldtitle,title } = req.body;
    if(!(oldtitle , title)){

        throw new apiError(401,"Quiz with old and new title are required")
    }
    const quiz = await Quiz.findOne({
        where: {
          title: oldtitle
        }
      });
      
     if(!quiz){

        throw new apiError(401,"Quiz not Found")
     }
  
     quiz.title = title ;
  
    await quiz.save();

    return res
      .status(200)
      .json(new apiResponse(200, quiz, "Quiz updated successfully"));
  });
  const deleteQuiz = asyncHandler(async (req, res) => {
    
    const { title } = req.body;
    
    if(!title){
        throw new apiError(401,"All fields are required")
    }
    const quiz = await Quiz.findOne({
        where: {
          title: title
        }
      });
    if (!quiz) {
      throw new apiError(404, "Quiz not found");
    }
    await quiz.destroy();

  return res
    .status(200)
    .json(new apiResponse(200, null, "Quiz deleted successfully"));
});


  export{
   adminLogin,
   adminLogout,
   refreshAdminAccessToken,
   createCourse,
   getAllCourses,
   getCourseId,
   updateCourse,
   deleteCourse,
   createLesson,
   updateLesson,
   getAllLessons,
   getLessonId,
   deleteLesson,
   createAssignment,
   getAllAssignments,
   getAssignmentId,
   deleteAssignment,
   updateAssignment,
   createQuiz,
   getAllQuizes,
   getQuizId,
   updateQuiz,
   deleteQuiz,
   getCourseIdfromLId
  }