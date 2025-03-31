import React, { useState, useEffect } from "react";
import { axiosInstance } from '../lib/axios'; 


const CategoryDropdown = ({ selectedCategories, onCategoryChange, onRemoveCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories");
        const categoryData = response.data.data || [];
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
    if (!selectedSubcategoryId) return;

  
    const alreadyExists = selectedCategories.some(
      (cat) => cat.categoryId === selectedSubcategoryId
    );
    if (!alreadyExists) {
 
      const newCat = {
        categoryId: selectedSubcategoryId,
        status: 'pending',
      };
      onCategoryChange([...selectedCategories, newCat]);
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
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                     focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
        {selectedCategories.map((cat, index) => {
          // cat: { categoryId, status }
        
          const subcategory = categories
            .flatMap((catObj) => catObj.subcategories)
            .find((sub) => sub._id === cat.categoryId);

    
          let bgColor = "bg-gray-100";
          if (cat.status === "pending") bgColor = "bg-yellow-100";
          if (cat.status === "verified") bgColor = "bg-green-100";
          if (cat.status === "declined") bgColor = "bg-red-100";

          const renderStatusBadge = () => {
            switch (cat.status) {
              case "pending":
                return (
                  <span className="inline-block ml-2 px-2 py-0.5 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">
                    PENDING
                  </span>
                );
              case "verified":
                return (
                  <span className="inline-block ml-2 px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                    VERIFIED
                  </span>
                );
              case "declined":
                return (
                  <span className="inline-block ml-2 px-2 py-0.5 text-xs font-semibold text-red-800 bg-red-200 rounded-full">
                    DECLINED
                  </span>
                );
              default:
                return null;
            }
          };

          return (
            <div key={index} className={`flex items-center justify-between p-2 rounded-md ${bgColor}`}>
              <span className="flex items-center">
                {subcategory ? subcategory.name : "Unknown"}
                {renderStatusBadge()}
              </span>
              <button
                type="button"
                onClick={() => onRemoveCategory(cat.categoryId)}
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
