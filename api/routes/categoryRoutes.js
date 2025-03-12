import express from 'express';
import { getCategories } from '../controllers/categoryController.js';

const router = express.Router();

// GET /api/categories
router.get('/categories', getCategories);

export default router;