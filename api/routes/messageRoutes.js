import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { sendMessage, getConversation } from "../controllers/messageController.js";

const router = express.Router();

router.use(protectRoute);

router.post("/send", sendMessage);
router.get("/conversation/:userId", getConversation); // 중복된 protectRoute 제거

export default router;