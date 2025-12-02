import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Authentication fields
    userID: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // --- PHẦN ROLE QUAN TRỌNG ---
    role: { 
        type: String, 
        default: "buyer", 
        enum: ["buyer", "seller", "admin"] // Chỉ cho phép 3 giá trị này
    },
    // ----------------------------
    
    // Profile fields
    name: { type: String },
    address: { type: String },
    phoneNumber: { type: String, match: [/^\+84\d{9}$/, 'Phone must be in +84XXXXXXXXX format'] },
    dob: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    profileImage: { type: String },
  },
  { timestamps: true }
);

// Hide password when converting to JSON
userSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password; return ret; }
});

// Prevent model recompilation in development
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;