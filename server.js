// server.js
import express from "express";
import cors from "cors";

// Load environment variables FIRST
import * as dotenv from "dotenv";
dotenv.config();

// DEBUG .env loading
console.log(">>> DEBUG: MONGO_URI =", process.env.MONGO_URI);

import { connectDB } from "./config/db.js";
import { swaggerDocs } from "./swagger.js";

// Import routes
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import ratingRouter from "./routes/ratingRoute.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import promotionRouter from "./routes/promotionRoute.js";
import revenueRouter from "./routes/revenueRoute.js";

// App config
const app = express();
const port = process.env.PORT || 4000;

// Middlewares
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Allow localhost on any port
    if (origin.match(/^http:\/\/localhost:\d+$/) || origin.match(/^http:\/\/127\.0\.0\.1:\d+$/)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token"]
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// Connect to MongoDB
connectDB();

// Root endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API endpoints
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/rating", ratingRouter);
app.use("/api/promotion", promotionRouter);
app.use("/api/revenue", revenueRouter);

// Static files
app.use("/images", express.static("uploads"));
app.use("/uploads", express.static("uploads")); // Serve all uploads including avatars

// Swagger documentation
swaggerDocs(app);

// Start server
app.listen(port, () => {
  console.log(`✅ Server started on http://localhost:${port}`);
  console.log(`📚 API Docs available at http://localhost:${port}/api-docs`);
});
