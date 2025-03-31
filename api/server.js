import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";

// routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import logRoutes from './routes/logRoutes.js';

import { connectDB } from "./config/db.js";
import { initializeSocket } from "./socket/socket.server.js";
import path from 'path';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();


console.log("CLIENT_URL:", process.env.CLIENT_URL);


initializeSocket(httpServer);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/categories", categoryRoutes);
app.use('/api/logs', logRoutes);

if(process.env.NODE_ENV === "production") {

  app.use(express.static(path.join(__dirname, '/client/dist')));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
}


const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();