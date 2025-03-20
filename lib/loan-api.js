// @/lib/loan-api.js
import api from "./api";

//-----------------SECURED LOAN APIs-------------------------

/**
 * Creates a new secured loan
 * @param {Object} loanData - Secured loan details
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/loan/secured-loan/
 * Payload: {
 *   loan_type: string,
 *   lender_name: string,
 *   loan_account_number: string,
 *   loan_amount: number,
 *   emi_amount: number,
 *   interest_rate: number,
 *   loan_start_date: string ("YYYY-MM-DD"),
 *   loan_end_date: string ("YYYY-MM-DD"),
 *   remaining_loan_balance: number,
 *   collateral_details: string,
 *   nominee_awareness: boolean,
 *   guarantor: string,
 *   notes: string,
 *   linked_bank_account: number,
 *   insurance: number
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const createSecuredLoan = async (loanData) => {
  try {
    const response = await api.post("/loan/secured-loan/", loanData);
    console.log("Create Secured Loan Response:", response);
    return response;
  } catch (error) {
    console.error("Create Secured Loan Error:", error);
    throw error;
  }
};

/**
 * Retrieves list of secured loans
 * @param {Object} params - Query parameters for filtering and sorting
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/loan/secured-loan/
 * Query Params: {
 *   loan_type: string | null,
 *   lender_name: string | null,
 *   loan_account_number: string | null,
 *   has_document: boolean | null,
 *   page: integer (default: 1),
 *   page_size: integer (default: 10),
 *   sort_by: string | null
 * }
 */
export const listSecuredLoans = async (params = {}) => {
  try {
    const response = await api.get("/loan/secured-loan/", { params });
    console.log("List Secured Loans Response:", response);
    return response;
  } catch (error) {
    console.error("List Secured Loans Error:", error);
    throw error;
  }
};

/**
 * Updates an existing secured loan
 * @param {number} id - Loan ID
 * @param {Object} loanData - Updated secured loan details
 * @returns {Promise} Response object
 * Request Type: PUT
 * Endpoint: /api/loan/secured-loan/{id}/
 */
export const updateSecuredLoan = async (id, loanData) => {
  try {
    const response = await api.put(`/loan/secured-loan/${id}/`, loanData);
    console.log("Update Secured Loan Response:", response);
    return response;
  } catch (error) {
    console.error("Update Secured Loan Error:", error);
    throw error;
  }
};

/**
 * Deletes a secured loan
 * @param {number} id - Loan ID
 * @returns {Promise} Response object
 * Request Type: DELETE
 * Endpoint: /api/loan/secured-loan/{id}/
 */
export const deleteSecuredLoan = async (id) => {
  try {
    const response = await api.delete(`/loan/secured-loan/${id}/`);
    console.log("Delete Secured Loan Response:", response);
    return response;
  } catch (error) {
    console.error("Delete Secured Loan Error:", error);
    throw error;
  }
};

/**
 * Retrieves details of a specific secured loan
 * @param {number} id - Loan ID
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/loan/secured-loan/{id}/
 */
export const getSecuredLoanDetails = async (id) => {
  try {
    const response = await api.get(`/loan/secured-loan/${id}/`);
    console.log("Get Secured Loan Details Response:", response);
    return response;
  } catch (error) {
    console.error("Get Secured Loan Details Error:", error);
    throw error;
  }
};

/**
 * Uploads a document for a secured loan
 * @param {number} id - Loan ID
 * @param {File} file - Document file to upload
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/loan/secured-loan/{id}/document/
 */
export const uploadSecuredLoanDocument = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/loan/secured-loan/${id}/document/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Upload Secured Loan Document Response:", response);
    return response;
  } catch (error) {
    console.error("Upload Secured Loan Document Error:", error);
    throw error;
  }
};

//-----------------UNSECURED LOAN APIs-------------------------

/**
 * Creates a new unsecured loan
 * @param {Object} loanData - Unsecured loan details
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/loan/unsecured-loan/
 * Payload: {
 *   lender_name: string,
 *   loan_amount: number,
 *   loan_start_date: string ("YYYY-MM-DD"),
 *   agreed_repayment_date: string ("YYYY-MM-DD"),
 *   interest_rate: number,
 *   payment_mode: string,
 *   remaining_balance: number,
 *   repayment_frequency: string,
 *   nominee_awareness: boolean,
 *   notes: string
 * }
 */
export const createUnsecuredLoan = async (loanData) => {
  try {
    const response = await api.post("/loan/unsecured-loan/", loanData);
    console.log("Create Unsecured Loan Response:", response);
    return response;
  } catch (error) {
    console.error("Create Unsecured Loan Error:", error);
    throw error;
  }
};

/**
 * Retrieves list of unsecured loans
 * @param {Object} params - Query parameters for filtering and sorting
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/loan/unsecured-loan/
 * Query Params: {
 *   lender_name: string | null,
 *   min_amount: number | null,
 *   max_amount: number | null,
 *   start_date: string | null,
 *   end_date: string | null,
 *   sort_by: string | null (default: "loan_start_date"),
 *   order: string | null (default: "asc"),
 *   page: integer (default: 1),
 *   page_size: integer (default: 10)
 * }
 */
export const listUnsecuredLoans = async (params = {}) => {
  try {
    const response = await api.get("/loan/unsecured-loan/", { params });
    console.log("List Unsecured Loans Response:", response);
    return response;
  } catch (error) {
    console.error("List Unsecured Loans Error:", error);
    throw error;
  }
};

/**
 * Updates an existing unsecured loan
 * @param {number} id - Loan ID
 * @param {Object} loanData - Updated unsecured loan details
 * @returns {Promise} Response object
 * Request Type: PUT
 * Endpoint: /api/loan/unsecured-loan/{id}/
 */
export const updateUnsecuredLoan = async (id, loanData) => {
  try {
    const response = await api.put(`/loan/unsecured-loan/${id}/`, loanData);
    console.log("Update Unsecured Loan Response:", response);
    return response;
  } catch (error) {
    console.error("Update Unsecured Loan Error:", error);
    throw error;
  }
};

/**
 * Deletes an unsecured loan
 * @param {number} id - Loan ID
 * @returns {Promise} Response object
 * Request Type: DELETE
 * Endpoint: /api/loan/unsecured-loan/{id}/
 */
export const deleteUnsecuredLoan = async (id) => {
  try {
    const response = await api.delete(`/loan/unsecured-loan/${id}/`);
    console.log("Delete Unsecured Loan Response:", response);
    return response;
  } catch (error) {
    console.error("Delete Unsecured Loan Error:", error);
    throw error;
  }
};

/**
 * Uploads a document for an unsecured loan
 * @param {number} id - Loan ID
 * @param {File} file - Document file to upload
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/loan/unsecured-loan/{id}/document/
 */
export const uploadUnsecuredLoanDocument = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/loan/unsecured-loan/${id}/document/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Upload Unsecured Loan Document Response:", response);
    return response;
  } catch (error) {
    console.error("Upload Unsecured Loan Document Error:", error);
    throw error;
  }
};