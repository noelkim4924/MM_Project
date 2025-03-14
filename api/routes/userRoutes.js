import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { getUserProfile, createUserProfile, updateProfile } from '../controllers/userController.js';

const router = express.Router();

router.get('/:userId', getUserProfile);
router.post('/', createUserProfile); 
router.put('/update', protectRoute, updateProfile); 

export default router;