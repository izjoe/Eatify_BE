import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Authentication fields
    userID: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["buyer", "seller"], default: "buyer" },
    
    // Profile fields
    name: { type: String },
    displayName: { type: String }, // Tên hiển thị cho seller
    address: { type: String },
    phoneNumber: { type: String, match: [/^\+84\d{9}$/, 'Phone must be in +84XXXXXXXXX format'] },
    dob: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    profileImage: { type: String },
    
    // Seller onboarding fields
    profileCompleted: { type: Boolean, default: false }, // Đánh dấu đã hoàn thành profile chưa
    onboardingShown: { type: Boolean, default: false }, // Đánh dấu đã show onboarding chưa
  },
  { timestamps: true // Auto add createdAt & updatedAt
  }
);

// Hide password when converting to JSON
userSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password; return ret; }
});

// Prevent model recompilation in development
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;