import api from "./api";

//-----------------BANK APIs-------------------------

/**
 * Validates an IFSC code
 * @param {string} ifsc - The IFSC code to validate
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/bank/validate-ifsc/{ifsc}/
 * Payload: None (IFSC in path)
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: {
 *     bank: string,
 *     branch: string,
 *     city: string,
 *     state: string,
 *     ifsc: string
 *   }
 * }
 */
export const validateIfsc = async (ifsc) => {
  try {
    const response = await api.get(`/bank/validate-ifsc/${ifsc}/`);
    console.log("Validate IFSC Response:", response);
    return response;
  } catch (error) {
    console.error("Validate IFSC Error:", error);
    throw error;
  }
};

/**
 * Creates a new bank account
 * @param {Object} bankData - Bank account details
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/bank/add-bank/
 * Payload: {
 *   account_holder_name: string,
 *   bank_name: string,
 *   branch_name: string,
 *   account_number: string,
 *   ifsc_code: string,
 *   account_type: "Savings" | "Current",
 *   linked_mobile_number: string,
 *   account_balance: number,
 *   account_opening_date: string (YYYY-MM-DD),
 *   account_status: "Active" | "Inactive",
 *   notes: string
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const addBank = async (bankData) => {
  try {
    const response = await api.post("/bank/add-bank/", bankData);
    console.log("Add Bank Response:", response);
    return response;
  } catch (error) {
    console.error("Add Bank Error:", error);
    throw error;
  }
};

/**
 * Retrieves list of bank accounts with optional filters
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/bank/bank-list/
 * Filters: {
 *   bank_name: string | null,
 *   branch_name: string | null,
 *   account_type: string | null,
 *   account_status: string | null,
 *   nominee: integer | null,
 *   account_balance__gte: number | null,
 *   account_balance__lte: number | null,
 *   account_opening_date__gte: string | null (YYYY-MM-DD),
 *   account_opening_date__lte: string | null (YYYY-MM-DD),
 *   sort_by: string | null (default: "account_holder_name"),
 *   order: string | null (default: "asc")
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: [{
 *     id: integer,
 *     created_at: string,
 *     updated_at: string,
 *     account_holder_name: string,
 *     bank_name: string,
 *     branch_name: string,
 *     account_number: string,
 *     ifsc_code: string,
 *     account_type: string,
 *     linked_mobile_number: string,
 *     account_balance: string,
 *     account_opening_date: string,
 *     account_status: string,
 *     passbook_or_statement: string,
 *     notes: string,
 *     nominee: array
 *   }]
 * }
 */
export const listBanks = async (params = {}) => {
  try {
    const response = await api.get("/bank/bank-list/", { params });
    console.log("List Banks Response:", response);
    return response;
  } catch (error) {
    console.error("List Banks Error:", error);
    throw error;
  }
};

/**
 * Retrieves details of a specific bank account
 * @param {number} bankId - The ID of the bank account
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/bank/bank-detail/{bank_id}/
 * Payload: None (bank_id in path)
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: {
 *     id: integer,
 *     created_at: string,
 *     updated_at: string,
 *     account_holder_name: string,
 *     bank_name: string,
 *     branch_name: string,
 *     account_number: string,
 *     ifsc_code: string,
 *     account_type: string,
 *     linked_mobile_number: string,
 *     account_balance: string,
 *     account_opening_date: string,
 *     account_status: string,
 *     passbook_or_statement: string,
 *     notes: string,
 *     nominee: array
 *   }
 * }
 */
export const getBankDetail = async (bankId) => {
  try {
    const response = await api.get(`/bank/bank-detail/${bankId}/`);
    console.log("Get Bank Detail Response:", response);
    return response;
  } catch (error) {
    console.error("Get Bank Detail Error:", error);
    throw error;
  }
};

/**
 * Adds a passbook/statement file to a bank account
 * @param {number} bankId - The ID of the bank account
 * @param {File} file - The passbook/statement file to upload
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/bank/{bank_id}/add-passbook/
 * Payload: FormData with file (binary)
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const addPassbook = async (bankId, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/bank/${bankId}/add-passbook/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Add Passbook Response:", response);
    return response;
  } catch (error) {
    console.error("Add Passbook Error:", error);
    throw error;
  }
};

/**
 * Deletes a bank account
 * @param {number} bankId - The ID of the bank account to delete
 * @returns {Promise} Response object
 * Request Type: DELETE
 * Endpoint: /api/bank/delete-bank/{bank_id}/
 * Payload: None (bank_id in path)
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const deleteBank = async (bankId) => {
  try {
    const response = await api.delete(`/bank/delete-bank/${bankId}/`);
    console.log("Delete Bank Response:", response);
    return response;
  } catch (error) {
    console.error("Delete Bank Error:", error);
    throw error;
  }
};

/**
 * Updates a bank account's details
 * @param {number} bankId - The ID of the bank account to update
 * @param {Object} bankData - Updated bank account details
 * @returns {Promise} Response object
 * Request Type: PUT
 * Endpoint: /api/bank/bank-edit/{bank_id}/
 * Payload: {
 *   account_holder_name: string,
 *   bank_name: string,
 *   branch_name: string,
 *   account_number: string,
 *   ifsc_code: string,
 *   account_type: "Savings" | "Current",
 *   linked_mobile_number: string,
 *   account_balance: number,
 *   account_opening_date: string (YYYY-MM-DD),
 *   account_status: "Active" | "Inactive",
 *   notes: string
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const updateBank = async (bankId, bankData) => {
  try {
    const response = await api.put(`/bank/bank-edit/${bankId}/`, bankData);
    console.log("Update Bank Response:", response);
    return response;
  } catch (error) {
    console.error("Update Bank Error:", error);
    throw error;
  }
};