import Category from '../models/Category.js';
import User from '../models/User.js';

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findOne({}); // Fetch the first document
    if (!categories) {
      return res.status(404).json({ message: 'Categories not found' });
    }
    res.status(200).json({ success: true, data: categories.categories }); // categories 
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

/////////////////////////////////////////
//CATEGORY METHODS
/////////////////////////////////////////

export const createCategory = async (req, res) => {
  try {
    const { name, subcategories } = req.body;
    const newCategory = {
      name,
      subcategories: subcategories.map(subcat => ({ name: subcat }))
    };

    const categoryDoc = await Category.findOneAndUpdate(
      {},
      { $push: { categories: newCategory } },
      { new: true }
    );

    res.status(201).json({ success: true, data: categoryDoc.categories });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update an existing category in the categories array
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subcategories } = req.body;

    // Find the category document
    const categoryDoc = await Category.findOne({ 'categories._id': id });
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update the category name
    const category = categoryDoc.categories.id(id);
    category.name = name;

    // Update subcategories
    subcategories.forEach(subcat => {
      const existingSubcategory = category.subcategories.id(subcat._id);
      if (existingSubcategory) {
        // Update existing subcategory
        existingSubcategory.name = subcat.name;
      } else {
        // Add new subcategory
        category.subcategories.push({ name: subcat.name });
      }
    });

    // Save the updated document
    await categoryDoc.save();

    res.status(200).json({ success: true, data: categoryDoc.categories });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a category from the categories array
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the category document
    const categoryDoc = await Category.findOne({ 'categories._id': id });
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Get the subcategory IDs to be removed
    const subcategoryIds = categoryDoc.categories.id(id).subcategories.map(subcat => subcat._id);

    // Remove the category
    await Category.findOneAndUpdate(
      {},
      { $pull: { categories: { _id: id } } },
      { new: true }
    );

    // Remove subcategory IDs from users
    await User.updateMany(
      {},
      { $pull: { categories: { categoryId: { $in: subcategoryIds } } } }
    );

    res.status(200).json({ success: true, data: categoryDoc.categories });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

/////////////////////////////////////////
//SUBCATEGORY METHODS
/////////////////////////////////////////

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

    // Remove subcategory ID from users
    await User.updateMany(
      {},
      { $pull: { categories: { categoryId: subcategoryId } } }
    );

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};