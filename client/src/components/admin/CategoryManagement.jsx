import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../lib/axios';
import { toast } from 'react-hot-toast';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', subcategories: [''] });
  const [editCategory, setEditCategory] = useState({});
  const [newSubcategory, setNewSubcategory] = useState({});
  const [editSubcategory, setEditSubcategory] = useState({});

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      console.log('Full response:', response);
      if (response.data && response.data.success) {
        console.log('Fetched categories:', response.data.data);
        setCategories(response.data.data);
        console.log('Categories state:', response.data.data);
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    if (newCategory.subcategories.some(subcat => !subcat.trim())) {
      toast.error('Subcategory names cannot be empty');
      return;
    }

    try {
      const response = await axiosInstance.post('/categories', newCategory);
      if (response.data && response.data.success) {
        console.log('Updated categories after adding category:', response.data.data);
        fetchCategories();
        setNewCategory({ name: '', subcategories: [''] });
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleEditCategory = async (categoryId) => {
    if (!editCategory[categoryId]) return;

    try {
      const response = await axiosInstance.put(`/categories/${categoryId}`, editCategory[categoryId]);
      if (response.data && response.data.success) {
        console.log('Updated categories after editing category:', response.data.data);
        fetchCategories();
        setEditCategory({ ...editCategory, [categoryId]: undefined });
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      console.error('Error editing category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    toast((t) => (
      <div className="text-center">
        <p>Are you sure you want to delete this category?</p><br />
        <button
          onClick={async () => {
            toast.dismiss(t.id);
            try {
              const response = await axiosInstance.delete(`/categories/${categoryId}`);
              if (response.data && response.data.success) {
                console.log('Updated categories after deleting category:', response.data.data);
                fetchCategories();
                toast.success('Category deleted successfully');
              } else {
                console.error('Unexpected response structure:', response.data);
                toast.error('Failed to delete category');
              }
            } catch (error) {
              console.error('Error deleting category:', error);
              toast.error('Error deleting category');
            }
          }}
          className="bg-red-500 text-white p-2 rounded-md ml-2"
        >
          Yes
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="bg-gray-500 text-white p-2 rounded-md ml-2"
        >
          No
        </button>
      </div>
    ));
  };

  const handleAddSubcategory = async (categoryId) => {
    if (!newSubcategory[categoryId] || !newSubcategory[categoryId].trim()) {
      toast.error('Subcategory name cannot be empty');
      return;
    }

    try {
      const response = await axiosInstance.post(`/categories/${categoryId}/subcategories`, {
        name: newSubcategory[categoryId],
      });
      if (response.data && response.data.success) {
        console.log('Updated categories after adding subcategory:', response.data.data);
        fetchCategories();
        setNewSubcategory({ ...newSubcategory, [categoryId]: '' });
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      console.error('Error adding subcategory:', error);
    }
  };

  const handleEditSubcategory = async (categoryId, subcategoryId) => {
    if (!editSubcategory[subcategoryId]) return;

    try {
      const response = await axiosInstance.put(`/categories/${categoryId}/subcategories/${subcategoryId}`, {
        name: editSubcategory[subcategoryId],
      });
      if (response.data && response.data.success) {
        console.log('Updated categories after editing subcategory:', response.data.data);
        fetchCategories();
        setEditSubcategory({ ...editSubcategory, [subcategoryId]: undefined });
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      console.error('Error editing subcategory:', error);
    }
  };

  const handleDeleteSubcategory = async (categoryId, subcategoryId) => {
    toast((t) => (
      <div className="text-center">
        <p>Are you sure you want to delete this subcategory?</p><br />
        <button
          onClick={async () => {
            toast.dismiss(t.id);
            try {
              const response = await axiosInstance.delete(`/categories/${categoryId}/subcategories/${subcategoryId}`);
              if (response.data && response.data.success) {
                console.log('Updated categories after deleting subcategory:', response.data.data);
                fetchCategories();
                toast.success('Subcategory deleted successfully');
              } else {
                console.error('Unexpected response structure:', response.data);
                toast.error('Failed to delete subcategory');
              }
            } catch (error) {
              console.error('Error deleting subcategory:', error);
              toast.error('Error deleting subcategory');
            }
          }}
          className="bg-red-500 text-white p-2 rounded-md ml-2"
        >
          Yes
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="bg-gray-500 text-white p-2 rounded-md ml-2"
        >
          No
        </button>
      </div>
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">Add New Category</h2>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="p-2 border rounded-md w-full mb-2"
            />
            {newCategory.subcategories.map((subcat, index) => (
              <input
                key={index}
                type="text"
                placeholder="Subcategory Name"
                value={subcat}
                onChange={(e) => {
                  const updatedSubcategories = [...newCategory.subcategories];
                  updatedSubcategories[index] = e.target.value;
                  setNewCategory({ ...newCategory, subcategories: updatedSubcategories });
                }}
                className="p-2 border rounded-md w-full mb-2"
              />
            ))}
            <button
              onClick={() => setNewCategory({ ...newCategory, subcategories: [...newCategory.subcategories, ''] })}
              className="bg-blue-500 text-white p-2 rounded-md w-full mb-2"
            >
              Add Subcategory
            </button>
            <button
              onClick={handleAddCategory}
              className="bg-green-500 text-white p-2 rounded-md w-full"
            >
              Save Category
            </button>
          </div>
          <div className="grid gap-4">
            {categories.map(category => (
              <div key={category._id} className="bg-white shadow-md rounded-lg p-4">
                {editCategory[category._id] !== undefined ? (
                  <>
                    <input
                      type="text"
                      value={editCategory[category._id].name}
                      onChange={(e) => setEditCategory({ ...editCategory, [category._id]: { ...editCategory[category._id], name: e.target.value } })}
                      className="p-2 border rounded-md w-full mb-2"
                    />
                    <button
                      onClick={() => handleEditCategory(category._id)}
                      className="bg-green-500 text-white p-2 rounded-md w-full mb-2"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
                    <button
                      onClick={() => setEditCategory({ ...editCategory, [category._id]: { name: category.name, subcategories: category.subcategories } })}
                      className="bg-yellow-500 text-white p-2 rounded-md w-full mb-2"
                    >
                      Edit
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="bg-red-500 text-white p-2 rounded-md w-full mb-2"
                >
                  Delete
                </button>
                <div className="grid grid-cols-1 gap-2 mb-4">
                  {Array.isArray(category.subcategories) && category.subcategories.map(subcategory => (
                    <div key={subcategory._id} className="bg-gray-100 p-2 rounded-md flex justify-between items-center">
                      {editSubcategory[subcategory._id] !== undefined ? (
                        <input
                          type="text"
                          value={editSubcategory[subcategory._id]}
                          onChange={(e) => setEditSubcategory({ ...editSubcategory, [subcategory._id]: e.target.value })}
                          className="p-2 border rounded-md w-full mr-2"
                        />
                      ) : (
                        <span>{subcategory.name}</span>
                      )}
                      <div className="flex space-x-2">
                        {editSubcategory[subcategory._id] !== undefined ? (
                          <button
                            onClick={() => handleEditSubcategory(category._id, subcategory._id)}
                            className="bg-green-500 text-white p-2 rounded-md"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditSubcategory({ ...editSubcategory, [subcategory._id]: subcategory.name })}
                            className="bg-yellow-500 text-white p-2 rounded-md"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteSubcategory(category._id, subcategory._id)}
                          className="bg-red-500 text-white p-2 rounded-md"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-100 p-2 rounded-md">
                  <input
                    type="text"
                    placeholder="New Subcategory Name"
                    value={newSubcategory[category._id] || ''}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, [category._id]: e.target.value })}
                    className="p-2 border rounded-md w-full mb-2"
                  />
                  <button
                    onClick={() => handleAddSubcategory(category._id)}
                    className="bg-blue-500 text-white p-2 rounded-md w-full"
                  >
                    Add Subcategory
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryManagement;