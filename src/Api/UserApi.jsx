import axios from "axios"
const token = localStorage.getItem('authToken');
const apiClient = axios.create({
    baseURL: "http://127.0.0.1:2000",
});
export const storeUser = async () => {
    try {
        const response = await apiClient.post('/api/register')
        console.log(response)
    } catch (error) {
        throw new Error("User creation failed" + error.message);
    }

}

export const login = async (userDetails) => {
    try {
        const response = await apiClient.post('/api/login', { email: userDetails.email, password: userDetails.password })
        return response
    } catch (error) {
        throw error.response.data
    }

}