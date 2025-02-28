import apiClient from '../services/apiClient';


export const storeExpense = async (expenseDetails) => {
  try {
    const response = await apiClient.post('/api/expenses', {
      amount: expenseDetails.amount,
      category_id: expenseDetails.category,
      description: expenseDetails.description,
      date: expenseDetails.date,
    });
    return response;
  } catch (error) {
    throw error.response?.data || { message: "Expense creation failed: " + error.message };
  }
};

export const getExpenses = async (categoryId = null) => {
  try {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await apiClient.get('/api/expenses', { params });
    return response;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch expenses: " + error.message };
  }
};

export const deleteExpense = async (expenseId) => {
  try {
    return await apiClient.delete(`/api/expenses/${expenseId}`);
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete expense: " + error.message };
  }
};

export const editExpense = async (formData) => {
  try {
    return await apiClient.put(`/api/expenses/${formData.id}`, {
      amount: formData.amount,
      category_id: formData.category,
      description: formData.description,
      date: formData.date,
    });
  } catch (error) {
    throw error.response?.data || { message: "Failed to update expense: " + error.message };
  }
};
