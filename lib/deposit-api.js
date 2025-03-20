// @/lib/deposit-api.js
import api from "./api";

//-----------------DEPOSIT APIs-------------------------

/**
 * Creates a new deposit
 * @param {Object} depositData - Deposit details
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/deposit/add-deposit/
 * Payload: {
 *   name: string,
 *   deposit_type: string ("FD"),
 *   installment: number,
 *   installment_type: string ("Monthly"),
 *   interest_rate: number,
 *   tenure: number,
 *   maturity_date: string ("YYYY-MM-DD"),
 *   maturity_amount: number,
 *   linked_mobile_number: string
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const createDeposit = async (depositData) => {
  try {
    const response = await api.post("/deposit/add-deposit/", depositData);
    console.log("Create Deposit Response:", response);
    return response;
  } catch (error) {
    console.error("Create Deposit Error:", error);
    throw error;
  }
};

/**
 * Retrieves list of deposits
 * @param {Object} params - Query parameters for filtering and sorting
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/deposit/list/
 * Query Params: {
 *   name: string | null,
 *   sort_by: string | null ("maturity_date" | "created_at" | "interest_rate"),
 *   order: string | null ("asc" | "desc")
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const listDeposits = async (params = {}) => {
  try {
    const response = await api.get("/deposit/list/", { params });
    console.log("List Deposits Response:", response);
    return response;
  } catch (error) {
    console.error("List Deposits Error:", error);
    throw error;
  }
};

/**
 * Retrieves details of a specific deposit
 * @param {string} depositType - Deposit type ("FD" | "RD")
 * @param {number} id - Deposit ID
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/deposit/{deposit_type}/{id}/
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: {
 *     id: number,
 *     created_at: string,
 *     updated_at: string,
 *     name: string,
 *     deposit_type: string,
 *     installment: string,
 *     installment_type: string,
 *     interest_rate: string,
 *     tenure: number,
 *     maturity_date: string,
 *     maturity_amount: string,
 *     linked_mobile_number: string,
 *     document: string,
 *     nominee: Array
 *   }
 * }
 */
export const getDepositDetail = async (depositType, id) => {
  try {
    const response = await api.get(`/deposit/${depositType}/${id}/`);
    console.log("Get Deposit Detail Response:", response);
    return response;
  } catch (error) {
    console.error("Get Deposit Detail Error:", error);
    throw error;
  }
};

/**
 * Deletes a deposit
 * @param {string} depositType - Deposit type ("FD" | "RD")
 * @param {number} id - Deposit ID
 * @returns {Promise} Response object
 * Request Type: DELETE
 * Endpoint: /api/deposit/delete-deposit/{deposit_type}/{id}/
 * Payload: None
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const deleteDeposit = async (depositType, id) => {
  try {
    const response = await api.delete(`/deposit/delete-deposit/${depositType}/${id}/`);
    console.log("Delete Deposit Response:", response);
    return response;
  } catch (error) {
    console.error("Delete Deposit Error:", error);
    throw error;
  }
};

/**
 * Updates a deposit
 * @param {string} depositType - Deposit type ("FD" | "RD")
 * @param {number} id - Deposit ID
 * @param {Object} depositData - Updated deposit details
 * @returns {Promise} Response object
 * Request Type: PUT
 * Endpoint: /api/deposit/update-deposit/{deposit_type}/{id}/
 * Payload: {
 *   name: string,
 *   installment: number,
 *   installment_type: string ("Monthly"),
 *   interest_rate: number,
 *   tenure: number,
 *   maturity_date: string ("YYYY-MM-DD"),
 *   maturity_amount: number,
 *   linked_mobile_number: string,
 *   deposit_type: null
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const updateDeposit = async (depositType, id, depositData) => {
  try {
    const response = await api.put(`/deposit/update-deposit/${depositType}/${id}/`, depositData);
    console.log("Update Deposit Response:", response);
    return response;
  } catch (error) {
    console.error("Update Deposit Error:", error);
    throw error;
  }
};

/**
 * Adds a document to a deposit
 * @param {number} id - Deposit ID
 * @param {File} file - Document file to upload
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/deposit/{id}/add-doc/
 * Payload: {
 *   file: binary
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const addDepositDocument = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/deposit/${id}/add-doc/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Add Deposit Document Response:", response);
    return response;
  } catch (error) {
    console.error("Add Deposit Document Error:", error);
    throw error;
  }
};