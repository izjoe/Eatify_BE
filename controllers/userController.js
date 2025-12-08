import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  console.log("🔵 Login attempt:", { email, passwordLength: password?.length });
  
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ success: false, message: "User Doesn't exist" });
    }
    
    console.log("✅ User found:", { email, role: user.role, hasPassword: !!user.password });
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔐 Password match:", isMatch);
    
    if (!isMatch) {
      console.log("❌ Invalid password for:", email);
      return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
    
    //  Ensure role is valid
    const userRole = (user.role === "seller" || user.role === "buyer") ? user.role : "buyer";
    const token = createToken(user._id);
    
    console.log(" Login successful:", { email, role: userRole });
    
    // return basic user data so frontend can prefill profile
    const userData = {
      name: user.name,
      displayName: user.displayName || user.name,
      email: user.email,
      dob: user.dob,
      address: user.address,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
      profileCompleted: user.profileCompleted || false,
      onboardingShown: user.onboardingShown || false,
    };
    
    res.status(200).json({ 
      success: true, 
      token, 
      role: userRole, 
      userID: user.userID,
      name: user.name,
      displayName: user.displayName || user.name,
      profileCompleted: user.profileCompleted || false,
      onboardingShown: user.onboardingShown || false,
      data: userData 
    });
  } catch (error) {
    console.log(" Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create token

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user

const registerUser = async (req, res) => {
  const { name, displayName, email, password, phoneNumber, dob, gender, role } = req.body;
  try {
    // checking user is already exist
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter valid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Please enter strong password (min 8 characters)",
      });
    }

    // ⚠️ Password hashing is handled by userModel pre-save hook
    // Do NOT hash here to avoid double-hashing

    // validate optional phoneNumber (Vietnamese format: +84xxxxxxxxx or 0xxxxxxxxx)
    if (phoneNumber !== undefined) {
      const phoneRegex = /^(\+84|0)\d{9}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ success: false, message: "Phone number must be in +84XXXXXXXXX or 0XXXXXXXXX format (9 digits after prefix)." });
      }
    }

    // parse optional dob (expect dd-mm-yyyy)
    let parsedDob;
    if (dob !== undefined) {
      const parseDob = (s) => {
        if (typeof s !== 'string') return null;
        const m = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (!m) return null;
        const day = parseInt(m[1], 10);
        const month = parseInt(m[2], 10);
        const year = parseInt(m[3], 10);
        const d = new Date(year, month - 1, day);
        if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
        return d;
      };
      parsedDob = parseDob(dob);
      if (!parsedDob) {
        return res.status(400).json({ success: false, message: "dob must be in dd-mm-yyyy format." });
      }
    }

    // Generate unique userID and userName
    const userID = "U" + Date.now();
    const userName = email.split('@')[0] + "_" + Date.now();
    
    //  Validate and set role (buyer or seller)
    const userRole = (role === "seller" || role === "buyer") ? role : "buyer";
    console.log(" Register:", { email, userRole });

    const newUser = new userModel({
      userID,
      userName,
      name: name,
      displayName: displayName || name, // Lưu displayName, fallback về name
      email: email,
      password: password, // Plain password - will be hashed by model pre-save hook
      role: userRole,  //  Save role from request
      profileCompleted: false, // Mặc định chưa hoàn thành profile
      onboardingShown: false, // Chưa show onboarding
      ...(phoneNumber !== undefined ? { phoneNumber } : {}),
      ...(parsedDob ? { dob: parsedDob } : {}),
      ...(gender !== undefined ? { gender } : {}),
    });

    const user = await newUser.save();
    
    console.log(" User registered:", { userID, email, role: user.role });
    
    //  Return 201 WITHOUT token - user must login
    res.status(201).json({ 
      success: true, 
      msg: "Registration successful. Please login.",
      userID: user.userID,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.log(" Register error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// get user profile (protected)
const getProfile = async (req, res) => {
  try {
    //  Get userId from req.userId (set by auth middleware) or fallback to req.body.userId
    const userId = req.userId || req.body.userId;
    const user = await userModel.findById(userId).select("-password");
    if (!user) return res.json({ success: false, message: "User not found" });
    
    // Validate required fields for checkout
    const requiredFields = ['name', 'email', 'phoneNumber', 'address'];
    const missingFields = requiredFields.filter(field => !user[field] || user[field].toString().trim() === '');
    
    // Return profile with validation status
    res.json({ 
      success: true, 
      data: user,
      isComplete: missingFields.length === 0,
      missingFields: missingFields
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error" });
  }
};

// update user profile (protected)
const updateProfile = async (req, res) => {
  try {
    //  Get userId from req.userId (set by auth middleware) or fallback to req.body.userId
    const userId = req.userId || req.body.userId;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const update = {};
    // accept only allowed fields (email, userID, role are NOT allowed - system managed only)
    const allowed = ["name", "dob", "address", "gender", "phoneNumber", "profileImage", "userName"];
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) update[f] = req.body[f];
    });
    
    // Remove empty string values to prevent validation errors
    Object.keys(update).forEach(key => {
      if (update[key] === '') {
        delete update[key];
      }
    });
    
    // validate userName if provided (unique, no spaces)
    if (update.userName !== undefined) {
      const userNameRegex = /^[a-zA-Z0-9_]+$/;
      if (!userNameRegex.test(update.userName)) {
        return res.status(400).json({ success: false, message: "userName must contain only letters, numbers, and underscores (no spaces)." });
      }
      // Check if userName is already taken by another user
      const existingUser = await userModel.findOne({ userName: update.userName });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ success: false, message: "userName already taken. Please choose another one." });
      }
    }

    // validate gender if provided
    if (update.gender !== undefined) {
      const allowedGenders = ["Male", "Female", "Other"];
      if (!allowedGenders.includes(update.gender)) {
        return res.status(400).json({ success: false, message: "Invalid gender. Allowed values: Male, Female, Other." });
      }
    }

    // validate phoneNumber if provided (Vietnamese format: +84xxxxxxxxx or 0xxxxxxxxx)
    if (update.phoneNumber !== undefined) {
      const phoneRegex = /^(\+84|0)\d{9}$/;
      if (!phoneRegex.test(update.phoneNumber)) {
        return res.status(400).json({ success: false, message: "Phone number must be in +84XXXXXXXXX or 0XXXXXXXXX format (9 digits after prefix)." });
      }
    }

    // parse dob if provided (dd-mm-yyyy)
    if (update.dob !== undefined) {
      const parseDob = (s) => {
        if (typeof s !== 'string') return null;
        const m = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (!m) return null;
        const day = parseInt(m[1], 10);
        const month = parseInt(m[2], 10);
        const year = parseInt(m[3], 10);
        const d = new Date(year, month - 1, day);
        if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
        return d;
      };
      const parsed = parseDob(update.dob);
      if (!parsed) {
        return res.status(400).json({ success: false, message: "dob must be in dd-mm-yyyy format." });
      }
      update.dob = parsed;
    }
    
    const user = await userModel.findByIdAndUpdate(userId, update, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Error updating profile" });
  }
};

// Admin: Update user's role (admin only)
const adminUpdateRole = async (req, res) => {
  try {
    //  Get userId from req.userId (admin's ID from auth middleware)
    const userId = req.userId || req.body.userId;
    const { targetUserId, newRole } = req.body;

    // Verify admin
    const admin = await userModel.findById(userId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin privileges required." 
      });
    }

    // Validate role
    const allowedRoles = ["user", "seller", "admin"];
    if (!allowedRoles.includes(newRole)) {
      return res.json({ 
        success: false, 
        message: "Invalid role. Allowed: user, seller, admin" 
      });
    }

    // Find target user
    const targetUser = await userModel.findById(targetUserId);
    if (!targetUser) {
      return res.json({ success: false, message: "Target user not found" });
    }

    // Prevent admin from demoting themselves
    if (userId === targetUserId && newRole !== "admin") {
      return res.json({ 
        success: false, 
        message: "You cannot change your own admin role" 
      });
    }

    // Update role
    targetUser.role = newRole;
    await targetUser.save();

    res.json({ 
      success: true, 
      message: `User role updated to ${newRole}`,
      data: { userID: targetUser.userID, role: targetUser.role }
    });

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error updating role" });
  }
};

// Admin: Update any user's profile (admin only)
const adminUpdateUser = async (req, res) => {
  try {
    //  Get userId from req.userId (admin's ID from auth middleware)
    const userId = req.userId || req.body.userId;
    const { targetUserId, ...updateFields } = req.body;

    // Verify admin
    const admin = await userModel.findById(userId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin privileges required." 
      });
    }

    // Find target user
    const targetUser = await userModel.findById(targetUserId);
    if (!targetUser) {
      return res.json({ success: false, message: "Target user not found" });
    }

    // Admin can update these fields
    const allowedFields = ["name", "email", "address", "phoneNumber", "dob", "gender"];
    const update = {};
    
    allowedFields.forEach(field => {
      if (updateFields[field] !== undefined) {
        update[field] = updateFields[field];
      }
    });

    // Validate email if provided
    if (update.email) {
      const emailExists = await userModel.findOne({ 
        email: update.email, 
        _id: { $ne: targetUserId } 
      });
      if (emailExists) {
        return res.json({ success: false, message: "Email already in use" });
      }
    }

    // Update user
    const updatedUser = await userModel.findByIdAndUpdate(
      targetUserId, 
      update, 
      { new: true }
    ).select("-password");

    res.json({ 
      success: true, 
      message: "User updated successfully",
      data: updatedUser 
    });

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error updating user" });
  }
};

// Upload avatar (protected)
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Return the filename for frontend to use
    const avatarUrl = req.file.filename;
    
    res.json({ 
      success: true, 
      message: "Avatar uploaded successfully",
      avatarUrl: avatarUrl,
      fullUrl: `${req.protocol}://${req.get('host')}/uploads/avatars/${avatarUrl}`
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error uploading avatar" });
  }
};

export { loginUser, registerUser, getProfile, updateProfile, adminUpdateRole, adminUpdateUser, uploadAvatar };
