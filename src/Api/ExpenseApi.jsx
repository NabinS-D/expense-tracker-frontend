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

export const storeExpense = async (expenseDetails) => {
    try {
        // Sending POST request with expense details
        const response = await apiClient.post('/api/expenses', {
            amount: expenseDetails.amount,
            category_id: expenseDetails.category,
            description: expenseDetails.description,
            date: expenseDetails.date,
        });
        return response;
    } catch (error) {
        throw new Error("Expense creation failed: " + error.message);
    }
};

export const getExpenses = async (categoryId = null) => {
    try {
        // Sending GET request to fetch expenses
        const response = await apiClient.get('/api/expenses', {
            params: { category_id: categoryId },
        });
        console.log(response);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const deleteExpense = async (expenseId) => {
    try {
        const response = await apiClient.delete('/api/expenses/' + expenseId);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const editExpense = async (NewformData) => {
    try {
        const response = await apiClient.put('/api/expenses/' + NewformData.id, {
            amount: NewformData.amount,
            category_id: NewformData.category,
            description: NewformData.description,
            date: NewformData.date,
        });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};
