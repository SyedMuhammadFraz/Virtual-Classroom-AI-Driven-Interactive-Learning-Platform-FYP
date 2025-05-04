import { asyncHandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/Apierror.js";
import { apiResponse } from "../utils/apiResponse.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import User from '../models/userModel.js';
import Enrollment from '../models/enrollmentmodel.js';
import moment from "moment";

const registerUser = asyncHandler(async (req, res) => {
    const { username, fullname,email, password, role,dob,contact } = req.body;
    if (!username || !email || !password || !role || !fullname || !contact || !dob) {
      throw new apiError(404,"All fields are required");
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password_hash: passwordHash,
      fullname,
      contact,
      dob,
      role,
      refreshtoken: null,  // Initially, we can leave refreshtoken as null
    });
    const createdUser = await User.findOne({
      where: { email: newUser.email },  
      attributes: { exclude: ['password_hash', 'refresh_token'] },  // Exclude password and refresh token
    });
      if(!createdUser){
        console.log("User Creation Failed")
        throw new apiError(400,"Error in registering the user")
      }
      console.log("User Registered Successfully")
      return  res.status(201).json( new apiResponse(200,createdUser,"User created Successfully"));
    });

    const generateAccessAndRefreshToken = async (userId) => {
      try {
        // Find user by primary key (id)
        const user = await User.findByPk(userId);
    
        if (!user) {
          throw new apiError(404, "User not found");
        }
    
        // Generate access and refresh tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
    
        // Update the user with the new refresh token
        await user.update({ refresh_token: refreshToken });
    
        // Return the tokens
        return { accessToken, refreshToken };
      } catch (error) {
        throw new apiError(500, "Something went wrong while generating access and refresh tokens");
      }
    };

    const loginUser = asyncHandler(async (req, res) => {

      // Destructuring required fields from request body
      const { email, password } = req.body;
  
      if (!(password || email)) {
          throw new apiError(400, "Email or password is required");
      }
  
      const user = await User.findOne({
        where: { email }
    });
  
      if (!user) {
          throw new apiError(404, "Invalid Email or Password");
      }
  
      // Check if password is correct
      const isPasswordValid = await user.isPasswordCorrect(password);
      if (!isPasswordValid) {
          throw new apiError(401, "Password incorrect");
      }
  
      // Generate access and refresh tokens
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user.id);
  
      // Select the user data excluding sensitive fields like password and refreshToken
      const loggedUser = await User.findByPk(user.id, {
          attributes: { exclude: ['password_hash', 'refresh_token'] }
      });
  
      // Cookie options
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None' // Required for cross-origin requests
      };
  
      return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(new apiResponse(200, { user: loggedUser, accessToken, refreshToken }, "User logged in successfully"));
  });

  const logout = asyncHandler(async (req, res) => {

        // Find the user by ID and unset the refresh_token
        const user = await User.findByPk(req.user.id); // Assuming `req.user.id` is available
        
        if (!user) {
            throw new apiError(404, "User not found");
        }

        // Update user by removing the refresh_token
        await user.update({
            refresh_token: null,  // Remove refresh token
        });

        const options = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'None' // Required for cross-origin requests
        };

        // Clear the cookies for access and refresh tokens
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new apiResponse(200, {}, "User logged out successfully"));
    } );
    
      const refreshAccessToken = asyncHandler(async (req, res) => {
      try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
        
        if (!incomingRefreshToken) {
          throw new apiError(401, "Unauthorized Request");
        }
    
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        const user = await User.findByPk(decodedToken?._id);
    
        if (!user) {
          throw new apiError(401, "Invalid refresh Token");
        }
    
        if (incomingRefreshToken !== user.refreshToken) {
          throw new apiError(401, "Refresh Token is expired or used");
        }
    
        const options = {
          httpOnly: true,
          secure: true
        };
    
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user.id);
    
        return res.status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(new ApiResponse(200, { refreshToken, accessToken }, "Access Token Refreshed"));
      } catch (error) {
        throw new apiError(401, error?.message || "Invalid Refresh Token");
      }
    });

    const updateUserProfile = asyncHandler(async (req, res) => {
      const { name,email,dob,contact } = req.body;
      if (!(name || email || dob || contact)) {
        throw new apiError(400, "All the fields are required");
    }
      const user = await User.findByPk(req.user?.id);
    
      if (!user) {
        throw new apiError(400, "User not found");
      }
    
      user.fullname = name;
      user.email = email;
      const formattedDob = moment(dob).format("YYYY-MM-DD");
      user.dob = formattedDob;
      user.contact = contact;
    
      await user.save({ validateBeforeSave: false });
    
      return res.status(200).json(
        new apiResponse(200, "Profile Updated successfully")
      );
    });
    const forgetPassword = asyncHandler(async (req, res) => {
      const { email , newPassword} = req.body;
    
      if (!( email )) {
        throw new apiError(400, "All the fields are required");
    }

    const user = await User.findOne({
      where: { email }
  });

    if (!user) {
        throw new apiError(404, "User doesn't exist");
    }
    
      user.password_hash = await bcrypt.hash(newPassword, 10); 
    
      await user.save({ validateBeforeSave: false });
    
      return res.status(200).json(
        new apiResponse(200, "Password changed Successfully")
      );
    });
    
    const getUserProfile = asyncHandler(async (req, res, next) => {
      try {
          const { id } = req.user; // Destructure id from req.user
          const existingUser = await User.findOne({ where: { id } });
  
          if (!existingUser) {
              throw new apiError(404, "User Not Found"); // Changed 401 to 404 (Not Found)
          }
  
          // Extract required fields
          const { fullname, email, dob, contact } = existingUser;
  
  
          return res.status(200).json(new apiResponse(200, { fullname, email, dob, contact }, "User details fetched successfully"));
      } catch (error) {
          next(error); // Pass errors to the error-handling middleware
      }
  });

  const enroll_course = asyncHandler(async (req, res, next) => {
    try {
      const student_id = req.user.id;
      const { course_id } = req.body;
  
      if (!course_id) {
        throw new apiError(400, "All fields are required");
      }
  
      // Check if student is already enrolled in the course
      const existingEnrollment = await Enrollment.findOne({
        where: { student_id, course_id }
      });
  
      if (existingEnrollment) {
        return res.status(409).json({
          message: "Enrollment already exists for this student and course",
        });
      }
  
      // Create new enrollment
      const newEnrollment = await Enrollment.create({
        student_id,
        course_id,
        enrolled_at: new Date(),  // Manually set the date if needed
      });
  
      return res.status(200).json(
        new apiResponse(200, { isEnrolled: true, enrollmentDetails: newEnrollment }, "Enrolled in course successfully")
      );      
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
  
  const getEnrollmentDetails = asyncHandler(async (req, res, next) => {
    try {
      const student_id = req.user.id; // assuming auth middleware adds req.user
      const { course_id } = req.body;
  
      if (!course_id) {
        return res.status(400).json(
          new apiResponse(400, null, "Course ID is required")
        );
      }
  
      const enrollments = await Enrollment.findAll({
        where: {
          student_id,
          course_id,
        },
      });
  
      if (!enrollments || enrollments.length === 0) {
        return res.status(200).json(
          new apiResponse(200, { isEnrolled: false }, "User is not enrolled in this course")
        );
      }
  
      return res.status(200).json(
        new apiResponse(200, { isEnrolled: true }, "User is enrolled in this course")
      );
  
    } catch (error) {
      next(error);
    }
  });
  const getEnrollmentData = asyncHandler(async (req, res, next) => {
    try {
      const student_id = req.user.id; // assuming auth middleware adds req.user
     
  
      const enrollments = await Enrollment.findAll({
        where: {
          student_id,
        },
      });
  
      if (!enrollments || enrollments.length === 0) {
        return res.status(200).json(
          new apiResponse(200,  "Record Not Found")
        );
      }
  
      return res.status(200).json(
        new apiResponse(200, enrollments, "All the data of the student enrollment fetched successfully.")
      );
  
    } catch (error) {
      next(error);
    }
  });
  
  
  
    export{

        registerUser,
        loginUser,
        logout,
        refreshAccessToken,
        updateUserProfile,
        forgetPassword,
        getUserProfile,
        enroll_course,
        getEnrollmentDetails,
        getEnrollmentData
      
    }

  