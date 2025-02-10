import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { connectDB } from './config/db.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); //req.body
app.use(cookieParser());

app.use("/api/auth"),authRoutes;
app.use("/api/users",userRoutes);
app.use("/api/matches",matchRoutes);
app.use("/api/messages",messageRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port" + PORT);
  connectDB();
});