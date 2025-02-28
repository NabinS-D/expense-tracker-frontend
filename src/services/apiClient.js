import axios from "axios";

// Use the correct environment variable syntax based on your build tool
const API_URL = process.env.REACT_APP_API_URL;
console.log("API Base URL:", API_URL);
// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
});

// Interceptor to add the token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handling response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized: Token expired or invalid");
      // You could redirect to login or clear tokens here
      localStorage.removeItem("authToken");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
