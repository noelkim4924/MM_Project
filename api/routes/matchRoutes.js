import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  swipeRight,
  swipeLeft,
  getMatches,
  getUserProfiles,
  acceptChatRequest, // 새 컨트롤러 추가
} from "../controllers/matchController.js";

const router = express.Router();

// 기존 swipe 로직
router.post("/swipe-right/:likedUserId", protectRoute, swipeRight);
router.post("/swipe-left/:likedUserId", protectRoute, swipeLeft);

// 매칭 목록 조회 (명확한 경로)
router.get("/my-matches", protectRoute, getMatches);

// 사용자 프로필 조회
router.get("/user-profiles", protectRoute, getUserProfiles);

// 채팅 요청 수락
router.post("/accept/:requestId", protectRoute, acceptChatRequest); // requestId로 수락 처리

export default router;