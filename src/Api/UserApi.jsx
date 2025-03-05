import apiClient from "../services/apiClient";

export const storeUser = async (userData) => {
  try {
    const response = await apiClient.post("/api/register", userData);
    return response;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "User creation failed: " + error.message,
      }
    );
  }
};

export const loginUser = async (userDetails) => {
  try {
    const response = await apiClient.post("/api/login", {
      email: userDetails.email,
      password: userDetails.password,
    });
    return response;
  } catch (error) {
    throw error.response?.data || { message: "Login failed: " + error.message };
  }
};
