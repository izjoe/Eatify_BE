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
      phone: user.phone,
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
  const { name, email, password } = req.body;
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

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
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
      phone: user.phone,
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
    // accept only allowed fields
    const allowed = ["name", "dob", "address", "gender", "phone", "profileImage", "email"];
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) update[f] = req.body[f];
    });
    const user = await userModel.findByIdAndUpdate(userId, update, { new: true }).select("-password");
    res.json({ success: true, data: user });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error" });
  }
};

export { loginUser, registerUser, getProfile, updateProfile };
