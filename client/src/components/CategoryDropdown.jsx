import React, { useState, useEffect } from "react";

const CategoryDropdown = ({ selectedCategories, onCategoryChange, onRemoveCategory, role }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/categories", {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("API Response:", data);
        const categoryData = data.data || (data.success ? data.data || [] : []);
        
        setCategories(categoryData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedSubcategoryId = e.target.value;
    if (selectedSubcategoryId && !selectedCategories.includes(selectedSubcategoryId)) {
      onCategoryChange([...selectedCategories, selectedSubcategoryId]);
    }
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (categories.length === 0) return <p>No categories available.</p>;

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
          {categories.map((category) => (
            <optgroup key={category._id} label={category.name}>
              {category.subcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="mt-2 space-y-2">
        {selectedCategories.map((categoryId, index) => {
          const subcategory = categories
            .flatMap((cat) => cat.subcategories)
            .find((sub) => sub._id === categoryId);
          return (
            <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
              <span>{subcategory ? subcategory.name : "Unknown"}</span>
              <button
                type="button"
                onClick={() => onRemoveCategory(categoryId)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryDropdown;