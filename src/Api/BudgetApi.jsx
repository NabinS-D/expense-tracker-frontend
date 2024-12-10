import axios from "axios";

// Create axios instance with base URL
const apiClient = axios.create({
    baseURL: "http://127.0.0.1:2000",
});

// Interceptor to add the token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // If token is available in localStorage, add it to the Authorization header
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // If an error occurs during the request setup
        return Promise.reject(error);
    }
);

// Handling response errors (optional)
apiClient.interceptors.response.use(
    (response) => response, // Return the response if it's successful
    (error) => {
        // Handle the error here if needed (e.g., token expired, 401 errors)
        if (error.response && error.response.status === 401) {
            console.log("Unauthorized: Token expired or invalid");
            // You can handle token expiration, log out, or redirect here
        }
        return Promise.reject(error);
    }
);

export const storeBudget = async (budget) => {
    try {
        // Sending POST request with budget details
        const response = await apiClient.post('/api/budgets', { amount: budget.amount, category_id: budget.category });
        if (response.status === 201) {
            return response;
        }
    } catch (error) {
        // Log the error response if it's a 422
        if (error.response && error.response.status === 422) {
            console.error("Validation errors:", error.response.data.errors);
        } else {
            console.error("Error storing budget:", error.message);
        }
        // Handle error and throw a custom error message
        throw new Error("Budget creation failed: " + (error.response?.data?.errors?.name ? error.response.data.errors.name[0] : error.message));
    }
};

export const getBudget = async () => {
    try {
        // Sending GET request to fetch budgets
        const response = await apiClient.get('/api/budgets');
        return response;
    } catch (error) {
        // Handle error and throw the error message
        throw error.response ? error.response.data : error.message;
    }
};

export const deleteBudget = async (budgetId) => {
    try {
        // Sending DELETE request to remove a budget
        const response = await apiClient.delete('/api/budgets/' + budgetId);
        return response;
    } catch (error) {
        // Handle error and throw the error message
        throw error.response ? error.response.data : error.message;
    }
};

export const editBudget = async (NewformData) => {
    try {
        // Sending PUT request to edit a budget
        const response = await apiClient.put('/api/budgets/' + NewformData.id, { amount: NewformData.amount, category_id: NewformData.category, month: NewformData.month, year: NewformData.year });
        return response;
    } catch (error) {
        // Handle error and throw the error message
        throw error.response ? error.response.data : error.message;
    }
};
