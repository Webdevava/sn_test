import api from "./api";
import Cookies from "js-cookie";

//-----------------PROFILE OPERATIONS-------------------------

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
      Cookies.set("profile", JSON.stringify(response.data.data), { expires: 7 });
    }
    return response.data;
  } catch (error) {
    if (error.response?.status === 400 && error.response.data?.data) {
      console.log("Get Profile Detail Response (400):", error.response.data);
      Cookies.set("profile", JSON.stringify(error.response.data.data), { expires: 7 });
      return error.response.data;
    }
    console.error("Get Profile Detail Error:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

//-----------------AUTH OPERATIONS-------------------------

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
    return response.data;
  } catch (error) {
    console.error("Delete Account Error:", error.response?.data || error);
    throw error.response?.data || error;
  }
};