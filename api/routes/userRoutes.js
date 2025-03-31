// userRoutes.js

import express from 'express';
import { protectRoute } from '../middleware/auth.js';


import {

  getAllUsers,
  adminUpdateUser,
  getPendingMentors,
  verifyMentorCategory,
  adminGetUserProfile, 


  getUserProfile,
  createUserProfile,
  updateProfile,
  requestCategoryVerification,
} from '../controllers/userController.js';

const router = express.Router();

/** =======================
 *      Admin Routes
 * ======================= */

router.get('/admin/users', /* isAdmin, */ getAllUsers);


router.get('/admin/users/:userId', /* isAdmin, */ adminGetUserProfile);


router.put('/admin/users/:userId', /* isAdmin, */ adminUpdateUser);


router.get('/pending-mentors', protectRoute, getPendingMentors);

router.post('/verify-category', protectRoute, verifyMentorCategory);


/** =======================
 *      Normal User Routes
 * ======================= */

router.post('/', createUserProfile);


router.put('/update', protectRoute, updateProfile);


router.post('/request-category-verification', protectRoute, requestCategoryVerification);


/** =======================
 *      Dynamic Route
 * ======================= */

router.get('/:userId', getUserProfile);


export default router;
