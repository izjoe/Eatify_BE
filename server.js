// server.js
import express from "express";
import cors from "cors";
import * as dotenv from 'dotenv';
import { connectDB } from "./config/db.js";
import { swaggerDocs } from "./src/swagger.js";

// Import routes
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import ratingRouter from "./routes/ratingRoute.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load environment variables first
dotenv.config();

// App config
const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors());

// DB connection
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

// Static files
app.use("/images", express.static("uploads"));

// Swagger documentation
swaggerDocs(app);

// Start server
app.listen(port, () => {
  console.log(`✅ Server started on http://localhost:${port}`);
  console.log(`📚 API Docs available at http://localhost:${port}/api-docs`);
});
