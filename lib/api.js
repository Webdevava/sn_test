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

// Response interceptor with 403 redirect
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.data);
    return response.data;
  },
  (error) => {
    console.error(`Response Error from ${error.config?.url}:`, error.response?.data || error);
    
    // Check if the error is a 403
    if (error.response?.status === 403) {
      // Clear tokens
      Cookies.remove("access_token", { path: "/" });
      Cookies.remove("refresh_token", { path: "/" });
      Cookies.remove("access_expiry", { path: "/" });
      Cookies.remove("refresh_expiry", { path: "/" });
      
      // Redirect to root
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
    
    return Promise.reject(error.response?.data || error);
  }
);

export default api;