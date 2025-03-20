import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`Request to ${config.url} with Authorization: Bearer ${token}`);
    } else {
      console.log(`No access token found for request to ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.data);
    return response.data;
  },
  (error) => {
    console.error(`Response Error from ${error.config?.url}:`, error.response?.data || error);
    return Promise.reject(error.response?.data || error);
  }
);

export default api;