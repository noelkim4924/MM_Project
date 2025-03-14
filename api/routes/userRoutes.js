import express from 'express';
import { protectRoute } from '../middleware/auth.js';
// 혹시 isAdmin 미들웨어가 있다면 import { isAdmin } from '../middleware/isAdmin.js';

import {
  getUserProfile,
  createUserProfile,
  updateProfile,
  verifyMentorCategory,
  requestCategoryVerification,
  getPendingMentors,  // 새로 추가
} from '../controllers/userController.js';

const router = express.Router();

router.get('/pending-mentors', protectRoute, getPendingMentors); // isAdmin 미사용 시
router.get('/:userId', getUserProfile);
router.post('/', createUserProfile); 
router.put('/update', protectRoute, updateProfile);

// (1) 멘토가 검증 요청
router.post('/request-category-verification', protectRoute, requestCategoryVerification);

// (2) 어드민이 특정 멘토 카테고리 승인/거절
router.post('/verify-category', protectRoute, verifyMentorCategory);

// (3) 어드민 전용: pending 멘토 목록 조회
// router.get('/pending-mentors', protectRoute, isAdmin, getPendingMentors); // isAdmin 있으면 이렇게

export default router;
