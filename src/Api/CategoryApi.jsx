import apiClient from '../services/apiClient';

export const storeCategory = async (category) => {
  try {
    return await apiClient.post('/api/categories', { name: category.name });
  } catch (error) {
    if (error.response?.status === 422) {
      console.error("Validation errors:", error.response.data.errors);
    }
    throw error.response?.data || { message: "Category creation failed: " + error.message };
  }
};

export const getCategory = async () => {
  try {
    return await apiClient.get('/api/categories');
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch categories: " + error.message };
  }
};

export const editCategory = async (formData) => {
  try {
    return await apiClient.put(`/api/categories/${formData.id}`, { 
      name: formData.name 
    });
  } catch (error) {
    throw error.response?.data || { message: "Failed to update category: " + error.message };
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    return await apiClient.delete(`/api/categories/${categoryId}`);
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete category: " + error.message };
  }
};
