// src/api/routes/messageRoutes.js
import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { sendMessage, getConversation, deleteConversation } from "../controllers/messageController.js";

const router = express.Router();

router.use(protectRoute);

router.post("/send", sendMessage);
router.get("/conversation/:userId", getConversation);
router.delete("/conversation/:userId", deleteConversation); // 대화 삭제 라우트 추가

export default router;