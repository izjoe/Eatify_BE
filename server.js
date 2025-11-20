// server.js
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";

// VỊ TRÍ MỚI VÀ CÚ PHÁP SỬA LỖI CHO DOTENV
import * as dotenv from 'dotenv'; 
dotenv.config(); // GỌI RÕ RÀNG ĐỂ TẢI BIẾN MÔI TRƯỜNG NGAY LẬP TỨC
// -----------------------------------------------------------------

import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// app config
const app = express();
const port =process.env.PORT || 4000; // Bây giờ process.env.PORT đã có giá trị

//middlewares
app.use(express.json());
app.use(cors());

// DB connection
connectDB(); // Lúc này connectDB có thể đọc process.env.MONGO_URL

// ... phần còn lại của file không đổi