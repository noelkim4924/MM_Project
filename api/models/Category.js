import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  categories: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      name: { type: String, required: true, unique: true },
      subcategories: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
          name: { type: String, required: true },
        },
      ],
    },
  ],
});

const Category = mongoose.model('Category', categorySchema);
export default Category;