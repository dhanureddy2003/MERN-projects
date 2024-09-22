import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.router.js";
import userRoutes from "./routes/user.router.js";
import postRoutes from "./routes/post.router.js";
import notificationRoutes from "./routes/notification.router.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
const app = express();
app.use(express.json({limit: "10mb"}));
dotenv.config();
app.use(express.urlencoded({limit: "10mb", extended: true }));
app.use(cookieParser());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notifications", notificationRoutes);
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    app.listen(process.env.PORT_NO, () => {
      console.log(`server is running in port :${process.env.PORT_NO} `);
    });
  } catch (error) {
    console.log(error.message);
  }
})();
