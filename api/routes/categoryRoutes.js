import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

router.post('/:categoryId/subcategories', createSubcategory);
router.put('/:categoryId/subcategories/:subcategoryId', updateSubcategory);
router.delete('/:categoryId/subcategories/:subcategoryId', deleteSubcategory);

export default router;