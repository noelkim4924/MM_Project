import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  mentees: [
    {
      category: String,
      subcategories: [String],
    },
  ],
  mentors: [
    {
      category: String,
      subcategories: [String],
    },
  ],
});

const Category = mongoose.model('Category', categorySchema);

export default Category;