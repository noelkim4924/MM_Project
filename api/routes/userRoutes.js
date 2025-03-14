// userRoutes.js

import express from 'express';
import { protectRoute } from '../middleware/auth.js';
// import { isAdmin } from '../middleware/isAdmin.js'; // (추후 필요 시)

import {
  // Admin
  getAllUsers,
  adminUpdateUser,
  getPendingMentors,
  verifyMentorCategory,
  adminGetUserProfile, // ← 관리자 전용 유저 상세조회

  // Normal user
  getUserProfile,
  createUserProfile,
  updateProfile,
  requestCategoryVerification,
} from '../controllers/userController.js';

const router = express.Router();

/** =======================
 *      Admin Routes
 * ======================= */
// (1) 모든 유저 목록 (검색/페이지네이션)
router.get('/admin/users', /* isAdmin, */ getAllUsers);

// (2) 특정 유저 상세조회 (관리자 전용)
router.get('/admin/users/:userId', /* isAdmin, */ adminGetUserProfile);

// (3) 특정 유저 강제 업데이트 (관리자 전용)
router.put('/admin/users/:userId', /* isAdmin, */ adminUpdateUser);

// (4) Pending 멘토 목록 조회
router.get('/pending-mentors', protectRoute, getPendingMentors);

// (5) 멘토 카테고리 승인/거절
router.post('/verify-category', protectRoute, verifyMentorCategory);


/** =======================
 *      Normal User Routes
 * ======================= */
// (6) 회원가입
router.post('/', createUserProfile);

// (7) 본인 프로필 업데이트
router.put('/update', protectRoute, updateProfile);

// (8) 멘토가 카테고리 검증 요청
router.post('/request-category-verification', protectRoute, requestCategoryVerification);


/** =======================
 *      Dynamic Route
 * ======================= */
// (9) 특정 유저 프로필 조회 (일반 유저용)
router.get('/:userId', getUserProfile);


export default router;
