import apiClient from '../services/apiClient';

export const storeBudget = async (budget) => {
  try {
    return await apiClient.post('/api/budgets', { 
      amount: budget.amount, 
      category_id: budget.category 
    });
  } catch (error) {
    if (error.response?.status === 422) {
      console.error("Validation errors:", error.response.data.errors);
    }
    throw error.response?.data || { message: "Budget creation failed: " + error.message };
  }
};

export const getBudget = async () => {
  try {
    return await apiClient.get('/api/budgets');
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch budgets: " + error.message };
  }
};

export const deleteBudget = async (budgetId) => {
  try {
    return await apiClient.delete(`/api/budgets/${budgetId}`);
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete budget: " + error.message };
  }
};

export const editBudget = async (formData) => {
  try {
    return await apiClient.put(`/api/budgets/${formData.id}`, { 
      amount: formData.amount, 
      category_id: formData.category,
      month: formData.month,
      year: formData.year
    });
  } catch (error) {
    throw error.response?.data || { message: "Failed to update budget: " + error.message };
  }
};