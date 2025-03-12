import React, { useState, useEffect } from "react";

const CategoryDropdown = ({ selectedCategories, onCategoryChange, onRemoveCategory }) => {
  const [categories, setCategories] = useState({ mentees: [], mentors: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories", {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedSubcategory = e.target.value;
    if (selectedSubcategory && !selectedCategories.includes(selectedSubcategory)) {
      onCategoryChange([...selectedCategories, selectedSubcategory]);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
        Categories
      </label>
      <div className="mt-1">
        <select
          id="categories"
          name="categories"
          onChange={handleCategoryChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
        >
          <option value="">Add a category</option>
          {categories.mentees.map((menteeCategory, index) => (
            <optgroup key={`mentee-${index}`} label={`Mentee: ${menteeCategory.category}`}>
              {menteeCategory.subcategories.map((subcategory, subIndex) => (
                <option key={`mentee-${index}-${subIndex}`} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </optgroup>
          ))}
          {categories.mentors.map((mentorCategory, index) => (
            <optgroup key={`mentor-${index}`} label={`Mentor: ${mentorCategory.category}`}>
              {mentorCategory.subcategories.map((subcategory, subIndex) => (
                <option key={`mentor-${index}-${subIndex}`} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="mt-2 space-y-2">
        {selectedCategories.map((category, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
          >
            <span>{category}</span>
            <button
              type="button"
              onClick={() => onRemoveCategory(category)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDropdown;