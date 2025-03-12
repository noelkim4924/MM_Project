import Category from '../models/Category.js';

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findOne({}); // Fetch the first document
    if (!categories) {
      return res.status(404).json({ message: 'Categories not found' });
    }
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};