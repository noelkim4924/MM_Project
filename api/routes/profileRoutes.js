import express from 'express';
import { getUserProfile, createUserProfile } from '../controllers/profileController.js';

const router = express.Router();

// Route to get user profile by user ID
router.get('/:userId', getUserProfile);

// Route to create a new user profile
router.post('/', createUserProfile);

export default router;