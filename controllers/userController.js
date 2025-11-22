import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const role = user.role;
    const token = createToken(user._id);
    // return basic user data so frontend can prefill profile
    const userData = {
      name: user.name,
      email: user.email,
      dob: user.dob,
      address: user.address,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
    };
    res.json({ success: true, token, role, data: userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Create token

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user

const registerUser = async (req, res) => {
  const { name, email, password, phoneNumber, dob, gender } = req.body;
  try {
    // checking user is already exist
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }

    // hashing user password

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    // validate optional phoneNumber
    if (phoneNumber !== undefined) {
      const phoneRegex = /^\+84\d{9}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.json({ success: false, message: "Phone number must be in +84XXXXXXXXX format." });
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
        return res.json({ success: false, message: "dob must be in dd-mm-yyyy format." });
      }
    }

    // Generate unique userID and userName
    const userID = "U" + Date.now();
    const userName = email.split('@')[0] + "_" + Date.now();

    const newUser = new userModel({
      userID,
      userName,
      name: name,
      email: email,
      password: hashedPassword,
      ...(phoneNumber !== undefined ? { phoneNumber } : {}),
      ...(parsedDob ? { dob: parsedDob } : {}),
      ...(gender !== undefined ? { gender } : {}),
    });

    const user = await newUser.save();
    const role = user.role;
    const token = createToken(user._id);
    const userData = {
      name: user.name,
      email: user.email,
      dob: user.dob,
      address: user.address,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
    };
    res.json({ success: true, token, role, data: userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// get user profile (protected)
const getProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await userModel.findById(userId).select("-password");
    if (!user) return res.json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error" });
  }
};

// update user profile (protected)
const updateProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
    const update = {};
    // accept only allowed fields (userID, role are NOT allowed - system managed only)
    const allowed = ["name", "dob", "address", "gender", "phoneNumber", "profileImage", "email", "userName"];
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) update[f] = req.body[f];
    });
    
    // validate userName if provided (unique, no spaces)
    if (update.userName !== undefined) {
      const userNameRegex = /^[a-zA-Z0-9_]+$/;
      if (!userNameRegex.test(update.userName)) {
        return res.json({ success: false, message: "userName must contain only letters, numbers, and underscores (no spaces)." });
      }
      // Check if userName is already taken by another user
      const existingUser = await userModel.findOne({ userName: update.userName });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.json({ success: false, message: "userName already taken. Please choose another one." });
      }
    }

    // validate gender if provided
    if (update.gender !== undefined) {
      const allowedGenders = ["Male", "Female", "Other"];
      if (!allowedGenders.includes(update.gender)) {
        return res.json({ success: false, message: "Invalid gender. Allowed values: Male, Female, Other." });
      }
    }

    // validate phoneNumber if provided (only digits after +84)
    if (update.phoneNumber !== undefined) {
      const phoneRegex = /^\+84\d{9}$/;
      if (!phoneRegex.test(update.phoneNumber)) {
        return res.json({ success: false, message: "Phone number must be in +84XXXXXXXXX format (digits only)." });
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
        return res.json({ success: false, message: "dob must be in dd-mm-yyyy format." });
      }
      update.dob = parsed;
    }
    const user = await userModel.findByIdAndUpdate(userId, update, { new: true }).select("-password");
    res.json({ success: true, data: user });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error" });
  }
};

export { loginUser, registerUser, getProfile, updateProfile };
