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
import { initEmailProvider } from "./providers/emailProvider.js";

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

    // Allow requests from development localhost
    if (origin.match(/^http:\/\/localhost:\d+$/) || origin.match(/^http:\/\/127\.0\.0\.1:\d+$/)) {
      return callback(null, true);
    }

    // Allow Render.com domains (for Swagger UI)
    if (origin && origin.includes('.onrender.com')) {
      return callback(null, true);
    }

    // Allow configured frontend URL (supports production frontend)
    const frontendUrl = process.env.FRONTEND_URL || "https://eatify-fe.vercel.app";
    if (origin === frontendUrl) return callback(null, true);

    // Allow the known deployed domain explicitly
    if (origin === "https://eatify-fe.vercel.app") return callback(null, true);

    // Allow Vercel preview deployments
    if (origin && origin.includes('.vercel.app')) {
      return callback(null, true);
    }

    console.log('❌ CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token", "accept"]
};

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// Connect to MongoDB
connectDB();

// Initialize Email Provider
initEmailProvider();

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

// Global error handler for Multer and other errors
import multer from 'multer';
app.use((err, req, res, next) => {
  // Handle Multer errors
  if (err instanceof multer.MulterError) {
    console.error('Multer Error:', err.code, err.field);
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
      code: err.code,
      field: err.field
    });
  }
  
  // Handle other errors
  if (err) {
    console.error('Server Error:', err.message);
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error'
    });
  }
  
  next();
});

// Start server (only in non-serverless environments)
// Vercel will handle the server automatically
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
    console.log(`API Docs available at http://localhost:${port}/api-docs`);
  });
}

// Export for Vercel serverless
export default app;
