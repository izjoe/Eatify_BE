import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    // Strong password validation
    if (password.length < 8) {
      return res.status(400).json({ 
        msg: "Password must be at least 8 characters long" 
      });
    }

    // Check password complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return res.status(400).json({ 
        msg: "Password must contain uppercase, lowercase, and numbers" 
      });
    }

    // Check if email already exists
    const exist = await userModel.findOne({ email });
    if (exist) return res.status(400).json({ msg: "Email already exists" });

    // Hash password with high cost factor
    const hashed = await bcrypt.hash(password, 12);

    // Generate unique IDs
    const userID = `U${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const userName = email.split('@')[0] + "_" + Date.now();

    const newUser = await userModel.create({
      userID,
      userName,
      name,
      email,
      password: hashed,
      role: "user"
    });

    // Generate token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ 
      msg: "Register success", 
      token,
      role: newUser.role,
      userID: newUser.userID 
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Rate limiting should be implemented here (use express-rate-limit package)

    const user = await userModel.findOne({ email });
    if (!user) {
      // Don't reveal whether user exists or not
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login success",
      token,
      role: user.role,
      userID: user.userID,
      name: user.name
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
