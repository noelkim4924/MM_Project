import Category from '../models/Category.js';

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findOne({}); // Fetch the first document
    if (!categories) {
      return res.status(404).json({ message: 'Categories not found' });
    }
    res.status(200).json({ success: true, data: categories.categories }); // categories 배열 반환
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, subcategories } = req.body;
    const newCategory = {
      name,
      subcategories: subcategories.map(subcat => ({ name: subcat }))
    };

    const category = await Category.create(newCategory);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update an existing category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subcategories } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, subcategories: subcategories.map(subcat => ({ name: subcat })) },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create a new subcategory
export const createSubcategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  try {
    const categoryDoc = await Category.findOneAndUpdate(
      { 'categories._id': categoryId },
      { $push: { 'categories.$.subcategories': { name } } },
      { new: true }
    );

    if (!categoryDoc) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, data: categoryDoc.categories });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update an existing subcategory
export const updateSubcategory = async (req, res) => {
  const { categoryId, subcategoryId } = req.params;
  const { name } = req.body;

  try {
    const category = await Category.findOne({ 'categories._id': categoryId });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const subcategory = category.categories.id(categoryId).subcategories.id(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    subcategory.name = name;
    await category.save();

    res.status(200).json({ success: true, data: category.categories.id(categoryId) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a subcategory
export const deleteSubcategory = async (req, res) => {
  const { categoryId, subcategoryId } = req.params;

  try {
    const category = await Category.findOneAndUpdate(
      { 'categories._id': categoryId },
      { $pull: { 'categories.$.subcategories': { _id: subcategoryId } } },
      { new: true }
    );

    if (!category) {
      console.error(`Category not found: ${categoryId}`);
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};