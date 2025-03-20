import api from "./api";
import Cookies from "js-cookie";

//-----------------AUTHENTICATION-------------------------

export const loginUser = async (mobile, password) => {
  try {
    const response = await api.post("/auth/login/", {
      mobile,
      password,
    });

    console.log("Login Response:", response);

    if (response.status) {
      saveAuthTokens(response);
    }

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await api.post("/auth/signup/", userData);

    console.log("Signup Response:", response);

    if (response.status) {
      saveAuthTokens(response, true); // Pass true to indicate signup token
    }

    return response;
  } catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
};

export const verifyOtp = async (otp) => {
  try {
    const signupToken = Cookies.get("signup_token");
    if (!signupToken) {
      throw new Error("Signup token not found. Please sign up again.");
    }
    const response = await api.post("/auth/verify-otp/", { otp });
    console.log("Verify OTP Response:", response);

    if (response.status) {
      saveAuthTokens(response);
      Cookies.remove("signup_token", { path: "/" });
    }

    return response;
  } catch (error) {
    console.error("Verify OTP Error:", error);
    throw error;
  }
};

export const resendOtp = async () => {
  try {
    const signupToken = Cookies.get("signup_token");
    if (!signupToken) {
      throw new Error("Signup token not found. Please sign up again.");
    }
    const response = await api.post("/auth/resend-otp/");
    console.log("Resend OTP Response:", response);
    return response;
  } catch (error) {
    console.error("Resend OTP Error:", error);
    throw error;
  }
};

//-----------------TOKEN MANAGEMENT-------------------------

const saveAuthTokens = (data, isSignup = false) => {
  console.log("Saving Tokens:", data);

  const now = new Date();
  const accessExpiryDate = new Date(now.getTime() + data.access_expiry * 1000); // Convert seconds to milliseconds
  const refreshExpiryDate = new Date(now.getTime() + data.refresh_expiry * 1000);

  const cookieOptions = {
    path: "/",
    expires: accessExpiryDate,
    secure: process.env.NODE_ENV === "production", // Only secure in production (allows http in dev)
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Lax in dev for testing
  };

  if (isSignup) {
    Cookies.set("signup_token", data.access_token, {
      ...cookieOptions,
      expires: accessExpiryDate,
    });
    console.log("Signup token set:", Cookies.get("signup_token"));
  } else {
    Cookies.set("access_token", data.access_token, {
      ...cookieOptions,
      expires: accessExpiryDate,
    });
    Cookies.set("refresh_token", data.refresh_token, {
      ...cookieOptions,
      expires: refreshExpiryDate,
    });
    Cookies.set("access_expiry", data.access_expiry, {
      ...cookieOptions,
      expires: accessExpiryDate,
    });
    Cookies.set("refresh_expiry", data.refresh_expiry, {
      ...cookieOptions,
      expires: refreshExpiryDate,
    });
    console.log("Access token set:", Cookies.get("access_token"));
    console.log("Refresh token set:", Cookies.get("refresh_token"));
  }
};


// Other API functions (unchanged but included for completeness)
export const addContact = async (contactData) => {
  try {
    const response = await api.post("/auth/contact/", {
      email: contactData.email,
      phone_number: contactData.phoneNumber,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const listContacts = async (params = {}) => {
  try {
    const response = await api.get("/auth/contact/", { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateContact = async (contactId, contactData) => {
  try {
    const response = await api.put(`/auth/contact/${contactId}/`, {
      email: contactData.email,
      phone_number: contactData.phoneNumber,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteContact = async (contactId) => {
  try {
    const response = await api.delete(`/auth/contact/${contactId}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getContactDetail = async (contactId) => {
  try {
    const response = await api.get(`/auth/contact/${contactId}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await api.post("/auth/change-password/", {
      old_password: passwordData.oldPassword,
      new_password: passwordData.newPassword,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteAccount = async () => {
  try {
    const response = await api.post("/auth/delete-account/");
    return response;
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = Cookies.get("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await api.post("/auth/refresh-token/", {
      refresh_token: refreshToken,
    });

    console.log("Refresh Token Response:", response);

    if (response.status) {
      saveAuthTokens(response);
      return response.access_token;
    }
  } catch (error) {
    console.error("Refresh Token Error:", error);
    throw error;
  }
};