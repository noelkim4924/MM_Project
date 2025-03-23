import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSubcategory, setNewSubcategory] = useState({});
  const [editSubcategory, setEditSubcategory] = useState({});

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/categories', {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
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

  const handleAddSubcategory = async (categoryId) => {
    if (!newSubcategory[categoryId]) return;

    try {
      const response = await axios.post(`http://localhost:5001/api/categories/${categoryId}/subcategories`, {
        name: newSubcategory[categoryId],
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.data && response.data.success) {
        console.log('Updated categories after adding subcategory:', response.data.data);
        fetchCategories(); // Refetch categories after adding
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
      const response = await axios.put(`http://localhost:5001/api/categories/${categoryId}/subcategories/${subcategoryId}`, {
        name: editSubcategory[subcategoryId],
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.data && response.data.success) {
        console.log('Updated categories after editing subcategory:', response.data.data);
        fetchCategories(); // Refetch categories after editing
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
          const response = await axios.delete(`http://localhost:5001/api/categories/${categoryId}/subcategories/${subcategoryId}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          });

          if (response.data && response.data.success) {
          console.log('Updated categories after deleting subcategory:', response.data.data);
          fetchCategories(); // Refetch categories after deleting
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
      ) : Array.isArray(categories) && categories.length > 0 ? (
        <div className="grid gap-4">
          {categories.map(category => (
            <div key={category._id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
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
      ) : (
        <p>No categories available</p>
      )}
    </div>
  );
};

export default CategoryManagement;