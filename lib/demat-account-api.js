// @/lib/demat-account-api.js
import api from "./api";

//-----------------DEMAT ACCOUNT APIs-------------------------

/**
 * Retrieves list of demat accounts
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/security/demat-acount/
 * Payload: None
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: [
 *     {
 *       id: integer,
 *       created_at: string,
 *       updated_at: string,
 *       depository_name: string,
 *       account_number: string,
 *       unique_client_code: string,
 *       dp_id: string,
 *       account_type: string,
 *       document: string
 *     }
 *   ]
 * }
 */
export const listDematAccounts = async () => {
  try {
    const response = await api.get("/security/demat-acount/");
    console.log("List Demat Accounts Response:", response);
    return response;
  } catch (error) {
    console.error("List Demat Accounts Error:", error);
    throw error;
  }
};

/**
 * Creates a new demat account
 * @param {Object} dematData - Demat account details
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/security/demat-acount/
 * Payload: {
 *   depository_name: string,
 *   account_number: string,
 *   unique_client_code: string,
 *   dp_id: string,
 *   account_type: string ("Individual" | etc.),
 *   bank_account: integer,
 *   linked_mobile: string
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const createDematAccount = async (dematData) => {
  try {
    const response = await api.post("/security/demat-acount/", dematData);
    console.log("Create Demat Account Response:", response);
    return response;
  } catch (error) {
    console.error("Create Demat Account Error:", error);
    throw error;
  }
};

/**
 * Updates an existing demat account
 * @param {number} id - The ID of the demat account to update
 * @param {Object} dematData - Updated demat account details
 * @returns {Promise} Response object
 * Request Type: PUT
 * Endpoint: /api/security/demat-acount/{id}/
 * Payload: {
 *   depository_name: string,
 *   account_number: string,
 *   unique_client_code: string,
 *   dp_id: string,
 *   account_type: string ("Individual" | etc.),
 *   bank_account: integer,
 *   linked_mobile: string
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const updateDematAccount = async (id, dematData) => {
  try {
    const response = await api.put(`/security/demat-acount/${id}/`, dematData);
    console.log("Update Demat Account Response:", response);
    return response;
  } catch (error) {
    console.error("Update Demat Account Error:", error);
    throw error;
  }
};

/**
 * Deletes a demat account
 * @param {number} id - The ID of the demat account to delete
 * @returns {Promise} Response object
 * Request Type: DELETE
 * Endpoint: /api/security/demat-acount/{id}/
 * Payload: None
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const deleteDematAccount = async (id) => {
  try {
    const response = await api.delete(`/security/demat-acount/${id}/`);
    console.log("Delete Demat Account Response:", response);
    return response;
  } catch (error) {
    console.error("Delete Demat Account Error:", error);
    throw error;
  }
};

/**
 * Retrieves details of a specific demat account
 * @param {number} id - The ID of the demat account
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/security/demat-acount/{id}/
 * Payload: None
 * Output: {
 *   data: {
 *     id: integer,
 *     created_at: string,
 *     updated_at: string,
 *     depository_name: string,
 *     account_number: string,
 *     unique_client_code: string,
 *     dp_id: string,
 *     account_type: string,
 *     document: string,
 *     nominee: [
 *       {
 *         first_name: string,
 *         last_name: string,
 *         relationship: string,
 *         percentage: integer,
 *         version: integer,
 *         id: integer
 *       }
 *     ]
 *   }
 * }
 */
export const getDematAccountDetail = async (id) => {
  try {
    const response = await api.get(`/security/demat-acount/${id}/`);
    console.log("Get Demat Account Detail Response:", response);
    return response;
  } catch (error) {
    console.error("Get Demat Account Detail Error:", error);
    throw error;
  }
};

/**
 * Uploads a document to a demat account
 * @param {number} id - The ID of the demat account
 * @param {File} file - The file to upload
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/security/demat-acount/{id}/document/
 * Payload: FormData with file (string($binary))
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const uploadDematAccountDocument = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/security/demat-acount/${id}/document/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Upload Demat Account Document Response:", response);
    return response;
  } catch (error) {
    console.error("Upload Demat Account Document Error:", error);
    throw error;
  }
};