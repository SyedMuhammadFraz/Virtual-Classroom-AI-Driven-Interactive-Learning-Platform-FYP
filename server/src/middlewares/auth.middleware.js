import { apiError } from "../utils/Apierror.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from 'jsonwebtoken';  // Corrected import
import User from "../models/userModel.js";
import { ADMIN_EMAIL } from "../constants.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Get token from cookies or headers
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new apiError(401, "Unauthorized request");
    }

    // Decode and verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user from DB using the decoded token ID
    const user = await User.findOne({
      where: { id: decodedToken?._id },  // Using the ID from the token to query
      attributes: { exclude: ['password_hash', 'refresh_token'] }  // Excluding sensitive fields
    });

    if (!user) {
      throw new apiError(401, "Invalid Access Token");
    }

    // Attach user to the request object
    req.user = user;
    next();
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid access token");
  }
});

export const verifyAdminJWT = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new apiError(401, "Access denied. No token provided");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify token

    // Check if the email matches the predefined admin email
    if (decodedToken.role !== "admin" && decodedToken.email != ADMIN_EMAIL) {
      throw new apiError(403, "Access denied. Admin only");
    }

    req.user = decodedToken; // Attach admin details to request
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid access token"); // Pass errors to the error handler
  }
};

