import api from "./api";
import Cookies from "js-cookie";

/**
 * Update user profile
 * @param {Object|FormData} profileData - Profile data (first_name, middle_name, last_name, pan, adhaar, dob, emergency_contacts, profile_picture)
 * @returns {Promise<Object>} - Response data from the API
 */
export const updateProfile = async (profileData) => {
  try {
    const isFormData = profileData instanceof FormData;
    const response = await api.post("/profile/profile-update/", profileData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    console.log("Update Profile Response:", response.data);
    
    // Update the cookie with the new profile data if successful
    if (response.data.status && response.data.data) {
      Cookies.set("profile", JSON.stringify(response.data.data), { expires: 7 });
    }
    
    return response.data;
  } catch (error) {
    console.error("Update Profile Error:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

/**
 * Get user profile details and store in cookies
 * @returns {Promise<Object>} - Response data from the API
 */
export const getProfileDetail = async () => {
  try {
    const response = await api.get("/profile/get-profile-detail/");
    console.log("Get Profile Detail Response:", response.data);
    
    if (response.data && response.data.data) {
      // Store the entire data object in cookies
      Cookies.set("profile", JSON.stringify(response.data.data), { expires: 7 });
    }
    
    return response.data;
  } catch (error) {
    // Handle 400 errors that might contain valid profile data
    if (error.response?.status === 400 && error.response.data?.data) {
      console.log("Get Profile Detail Response (400):", error.response.data);
      Cookies.set("profile", JSON.stringify(error.response.data.data), { expires: 7 });
      return error.response.data;
    }
    
    console.error("Get Profile Detail Error:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

/**
 * Add picture to user profile
 * @param {File} file - The picture file to upload
 * @returns {Promise<Object>} - Response data from the API
 */
export const addProfile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await api.post("/profile/add-profile/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Add Profile Response:", response.data);
    
    // Update the cookie with new profile data if available
    if (response.data.status && response.data.data) {
      // Try to get existing cookie data first
      const existingProfile = Cookies.get("profile");
      if (existingProfile) {
        try {
          const profileData = JSON.parse(existingProfile);
          // Update profile picture in cookie data
          if (response.data.data.profile_picture) {
            profileData.profile_picture = response.data.data.profile_picture;
            Cookies.set("profile", JSON.stringify(profileData), { expires: 7 });
          }
        } catch (err) {
          console.error("Error updating cookie after file upload:", err);
        }
      }
    }
    
    return response.data; // { status: true, message: string, data: [] }
  } catch (error) {
    console.error("Add Profile Error:", error.response?.data || error);
    if (error.response?.status === 422) {
      throw error.response.data; // { detail: [{ loc: [string, number], msg: string, type: string }] }
    }
    throw error.response?.data || error;
  }
};

/**
 * Change user password
 * @param {Object} passwordData - Password data (old_password, new_password)
 * @returns {Promise<Object>} - Response data from the API
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await api.post("/auth/change-password/", passwordData);
    console.log("Change Password Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Change Password Error:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

/**
 * Delete user account
 * @returns {Promise<Object>} - Response data from the API
 */
export const deleteAccount = async () => {
  try {
    const response = await api.post("/auth/delete-account/");
    console.log("Delete Account Response:", response.data);
    
    // Clear profile cookie on successful account deletion
    if (response.data.status) {
      Cookies.remove("profile");
    }
    
    return response.data;
  } catch (error) {
    console.error("Delete Account Error:", error.response?.data || error);
    throw error.response?.data || error;
  }
};