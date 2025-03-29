// src/api/routes/matchRoutes.js
import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { acceptChatRequest, swipeRight, swipeLeft, getMatches, getUserProfiles, unmatchUser } from "../controllers/matchController.js";

const router = express.Router();

router.use(protectRoute);

router.post("/accept/:requestId", acceptChatRequest);
router.post("/swipe-right/:likedUserId", swipeRight);
router.post("/swipe-left/:likedUserId", swipeLeft);
router.get("/my-matches", getMatches);
router.get("/user-profiles", getUserProfiles);
router.post("/unmatch/:userId", unmatchUser); // 매칭 해제 라우트 추가

export default router;