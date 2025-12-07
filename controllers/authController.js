import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

export const registerUser = async (req, res) => {
  try {
    const { name, displayName, email, password, role } = req.body;
    
    console.log("📝 Register request received:", { name, displayName, email, role });

    // Validate email format
    if (!validator.isEmail(email)) {
      console.log("❌ Invalid email format:", email);
      return res.status(400).json({ msg: "Invalid email format" });
    }

    // Strong password validation
    if (password.length < 8) {
      console.log("❌ Password too short:", password.length);
      return res.status(400).json({ 
        msg: "Password must be at least 8 characters long" 
      });
    }

    // Check password complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      console.log("❌ Password complexity check failed");
      return res.status(400).json({ 
        msg: "Password must contain uppercase, lowercase, and numbers" 
      });
    }

    // Check if email already exists
    const exist = await userModel.findOne({ email });
    if (exist) {
      console.log("❌ Email already exists:", email);
      return res.status(400).json({ msg: "Email already exists" });
    }

    // Hash password with high cost factor
    const hashed = await bcrypt.hash(password, 12);

    // Generate unique IDs
    const userID = `U${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const userName = email.split('@')[0] + "_" + Date.now();

    // ✅ Lưu role từ frontend (buyer hoặc seller)
    const userRole = role && (role === "seller" || role === "buyer") ? role : "buyer";
    console.log("✅ User role will be saved as:", userRole);

    const newUser = await userModel.create({
      userID,
      userName,
      name,
      displayName: displayName || name, // Lưu displayName, fallback về name
      email,
      password: hashed,
      role: userRole,
      profileCompleted: false, // Mặc định chưa hoàn thành profile
      onboardingShown: false, // Chưa show onboarding
    });

    console.log("✅ User created successfully:", { userID, email, role: newUser.role });

    // ✅ Return 201 Created - NO TOKEN GENERATED
    // User must login to get token
    res.status(201).json({ 
      success: true,
      msg: "Registration successful. Please login with your credentials.",
      userID: newUser.userID,
      email: newUser.email,
      role: newUser.role,
      displayName: newUser.displayName
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      // Don't reveal whether user exists or not
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // ✅ Generate JWT Token
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET not configured");
      return res.status(500).json({ msg: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful for:", email, "Token:", token.substring(0, 20) + "...", "Role:", user.role);

    // ✅ Return 200 OK with token + role + seller onboarding data
    res.status(200).json({
      success: true,
      msg: "Login successful",
      token: token,
      role: user.role,
      userID: user.userID,
      name: user.name,
      displayName: user.displayName || user.name,
      email: user.email,
      profileCompleted: user.profileCompleted || false,
      onboardingShown: user.onboardingShown || false,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ 
      msg: "Server error during login", 
      error: error.message 
    });
  }
};

// GET /api/auth/me - Lấy thông tin user hiện tại
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        userID: user.userID,
        name: user.name,
        displayName: user.displayName || user.name,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted || false,
        onboardingShown: user.onboardingShown || false,
        profileImage: user.profileImage,
      }
    });
  } catch (error) {
    console.error("❌ Get current user error:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// PUT /api/auth/mark-onboarding-shown - Đánh dấu đã show onboarding
export const markOnboardingShown = async (req, res) => {
  try {
    const userId = req.userId;
    
    await userModel.findByIdAndUpdate(userId, { 
      onboardingShown: true 
    });

    res.status(200).json({
      success: true,
      msg: "Onboarding marked as shown"
    });
  } catch (error) {
    console.error("❌ Mark onboarding error:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// PUT /api/auth/mark-profile-completed - Đánh dấu đã hoàn thành profile
export const markProfileCompleted = async (req, res) => {
  try {
    const userId = req.userId;
    
    await userModel.findByIdAndUpdate(userId, { 
      profileCompleted: true,
      onboardingShown: true // Cũng đánh dấu đã show onboarding
    });

    res.status(200).json({
      success: true,
      msg: "Profile marked as completed"
    });
  } catch (error) {
    console.error("❌ Mark profile completed error:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
