import express from "express";
import { protectRoute } from '../middleware/auth';

const router = express.Router();

router.post("/swipe-right/ : likedUserId",protectRoute, swipeRight);
router.post("/swipe-left/ : likedUserId",protectRoute, swipeLeft);

router.get("/", protectRoute, getMatches);
router.get("/user-profiles", protectRoute, getUserProfiles);

export default router;