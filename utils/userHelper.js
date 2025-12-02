// utils/userHelper.js
// Helper functions to avoid code duplication

import userModel from "../models/userModel.js";

/**
 * Get user by ID from auth middleware
 * @param {string} userId - MongoDB _id from JWT token
 * @returns {Promise<Object>} User object or null
 */
export const getUserById = async (userId) => {
  try {
    return await userModel.findById(userId);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

/**
 * Get user and verify they exist
 * Returns formatted error response if user not found
 * @param {string} userId - MongoDB _id from JWT token
 * @param {Object} res - Express response object
 * @returns {Promise<Object|null>} User object or null (with response sent)
 */
export const getUserOrFail = async (userId, res) => {
  const user = await getUserById(userId);
  if (!user) {
    res.json({ success: false, message: "User not found" });
    return null;
  }
  return user;
};

/**
 * Check if user has required role
 * @param {Object} user - User object
 * @param {string|string[]} allowedRoles - Single role or array of roles
 * @returns {boolean}
 */
export const hasRole = (user, allowedRoles) => {
  if (!user || !user.role) return false;
  
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(user.role);
  }
  
  return user.role === allowedRoles;
};

/**
 * Check if user is admin
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return user && user.role === "admin";
};

/**
 * Check if user is seller or admin
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isSellerOrAdmin = (user) => {
  return user && (user.role === "seller" || user.role === "admin");
};
