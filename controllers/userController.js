import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// --- Helper: Create Token ---
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// --- Helper: Parse Date ---
const parseDateHelper = (dateString) => {
  if (!dateString) return null;
  const isoDate = new Date(dateString);
  if (!isNaN(isoDate.getTime())) return isoDate;
  const parts = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (parts) return new Date(parts[3], parts[2] - 1, parts[1]);
  return null;
};

// 1. LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
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
    
    // Trả về cả ROLE để frontend lưu lại
    res.json({ success: true, token, role: user.role, data: userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// 2. REGISTER USER (Đã thêm logic Role)
const registerUser = async (req, res) => {
  // Lấy thêm biến role từ req.body
  const { name, email, password, phoneNumber, dob, gender, role } = req.body;
  
  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter strong password (min 8 chars)" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    if (phoneNumber) {
      const phoneRegex = /^(\+84|0)\d{9,10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.json({ success: false, message: "Phone number invalid format." });
      }
    }

    let finalDob = null;
    if (dob) {
        finalDob = parseDateHelper(dob);
        if (!finalDob) return res.json({ success: false, message: "Date format invalid" });
    }

    const userID = "U" + Date.now();
    const userName = email.split('@')[0] + "_" + Date.now();

    const newUser = new userModel({
      userID,
      userName,
      name,
      email,
      password: hashedPassword,
      ...(phoneNumber && { phoneNumber }),
      ...(finalDob && { dob: finalDob }),
      ...(gender && { gender }),
      
      // --- LOGIC LƯU ROLE ---
      // Nếu user chọn seller thì lưu seller, còn lại mặc định là buyer (tránh hack admin)
      role: role === "seller" ? "seller" : "buyer"
      // ----------------------
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    
    // Trả về role để frontend lưu
    res.json({ success: true, token, role: user.role, data: { name: user.name, email: user.email } });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// 3. GET PROFILE
const getProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await userModel.findById(userId).select("-password");
    if (!user) return res.json({ success: false, message: "User not found" });
    
    let formattedUser = user.toObject();
    if (formattedUser.dob) {
        formattedUser.dob = new Date(formattedUser.dob).toISOString().split('T')[0];
    }
    res.json({ success: true, data: formattedUser });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error loading profile" });
  }
};

// 4. UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
    const update = {};
    const allowed = ["name", "dob", "address", "gender", "phoneNumber", "profileImage", "userName"];
    
    allowed.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        update[field] = req.body[field];
      }
    });

    if (update.gender) {
        update.gender = update.gender.charAt(0).toUpperCase() + update.gender.slice(1).toLowerCase();
        const allowedGenders = ["Male", "Female", "Other"];
        if (!allowedGenders.includes(update.gender)) delete update.gender;
    }

    if (update.phoneNumber) {
        const phoneRegex = /^(\+84|0)\d{9,10}$/;
        if (!phoneRegex.test(update.phoneNumber)) return res.json({ success: false, message: "Phone number invalid" });
    }

    if (update.dob) {
        const dateObj = parseDateHelper(update.dob);
        if (dateObj) update.dob = dateObj;
        else delete update.dob;
    }

    if (update.userName) {
        const userNameRegex = /^[a-zA-Z0-9_]+$/;
        if (!userNameRegex.test(update.userName)) return res.json({ success: false, message: "Invalid UserName format" });
        const existing = await userModel.findOne({ userName: update.userName });
        if (existing && existing._id.toString() !== userId) return res.json({ success: false, message: "UserName already taken" });
    }

    const user = await userModel.findByIdAndUpdate(userId, update, { new: true }).select("-password");
    if(!user) return res.json({ success: false, message: "User not found" });

    res.json({ success: true, message: "Profile Updated Successfully", data: user });
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.json({ success: false, message: err.message || "Error updating profile" });
  }
};

export { loginUser, registerUser, getProfile, updateProfile };