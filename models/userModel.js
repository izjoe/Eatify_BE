import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    // Authentication fields
    userID: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Will be hashed automatically
    role: { type: String, enum: ["buyer", "seller"], default: "buyer" },
    
    // Profile fields
    name: { type: String },
    displayName: { type: String }, // Display name for seller
    address: { type: String },
    phoneNumber: {
      type: String,
      match: [/^\+84\d{9}$/, "Phone must be in +84XXXXXXXXX format"]
    },
    dob: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    profileImage: { type: String },
    
    // Seller onboarding fields
    profileCompleted: { type: Boolean, default: false }, // Mark if profile is completed
    onboardingShown: { type: Boolean, default: false }, // Mark if onboarding was shown
  },
  { timestamps: true } // Auto add createdAt & updatedAt
);


// Hash password (create / save)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Avoid re-hashing
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Hash password when insertMany()
userSchema.pre("insertMany", async function (next, docs) {
  for (const doc of docs) {
    if (doc.password) {
      const salt = await bcrypt.genSalt(10);
      doc.password = await bcrypt.hash(doc.password, salt);
    }
  }
  next();
});

// Compare password (login)
userSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

// Hide password when converting to JSON
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  }
});

// Prevent model recompilation in development
const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
