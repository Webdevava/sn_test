// @/lib/term-insurance-api.js
import api from "./api";

//-----------------TERM INSURANCE APIs-------------------------

/**
 * Creates a new term insurance
 * @param {Object} insuranceData - Term insurance details
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/insurance/term-insurance/
 * Payload: {
 *   policy_name: string,
 *   policy_number: string,
 *   insurer_name: string,
 *   sum_assured: number,
 *   premium_amount: number,
 *   policy_term: number,
 *   maturity_date: string ("YYYY-MM-DD"),
 *   start_date: string ("YYYY-MM-DD"),
 *   linked_mobile: string,
 *   coverage_detail: string[],
 *   installment_type: string ("Annually")
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const createTermInsurance = async (insuranceData) => {
  try {
    const response = await api.post("/insurance/term-insurance/", insuranceData);
    console.log("Create Term Insurance Response:", response);
    return response;
  } catch (error) {
    console.error("Create Term Insurance Error:", error);
    throw error;
  }
};

/**
 * Retrieves list of term insurances
 * @param {Object} params - Query parameters for sorting
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/insurance/list-term-insurance/
 * Query Params: {
 *   sort_by: string | null,
 *   order: string | null ("asc" | "desc")
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const listTermInsurances = async (params = {}) => {
  try {
    const response = await api.get("/insurance/list-term-insurance/", { params });
    console.log("List Term Insurances Response:", response);
    return response;
  } catch (error) {
    console.error("List Term Insurances Error:", error);
    throw error;
  }
};

/**
 * Retrieves details of a specific term insurance
 * @param {number} id - Insurance ID
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/insurance/term-insurance/{id}/
 * Output: {
 *   data: {
 *     id: number,
 *     created_at: string,
 *     updated_at: string,
 *     policy_name: string,
 *     policy_number: string,
 *     insurer_name: string,
 *     sum_assured: string,
 *     premium_amount: string,
 *     policy_term: number,
 *     maturity_date: string,
 *     start_date: string,
 *     linked_mobile: string,
 *     document: string,
 *     coverage_detail: string,
 *     installment_type: string,
 *     nominee: Array
 *   }
 * }
 */
export const getTermInsuranceDetail = async (id) => {
  try {
    const response = await api.get(`/insurance/term-insurance/${id}/`);
    console.log("Get Term Insurance Detail Response:", response);
    return response;
  } catch (error) {
    console.error("Get Term Insurance Detail Error:", error);
    throw error;
  }
};

/**
 * Updates a term insurance
 * @param {number} id - Insurance ID
 * @param {Object} insuranceData - Updated insurance details
 * @returns {Promise} Response object
 * Request Type: PUT
 * Endpoint: /api/insurance/term-insurance/{id}/
 * Payload: Same as createTermInsurance
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const updateTermInsurance = async (id, insuranceData) => {
  try {
    const response = await api.put(`/insurance/term-insurance/${id}/`, insuranceData);
    console.log("Update Term Insurance Response:", response);
    return response;
  } catch (error) {
    console.error("Update Term Insurance Error:", error);
    throw error;
  }
};

/**
 * Deletes a term insurance
 * @param {number} id - Insurance ID
 * @returns {Promise} Response object
 * Request Type: DELETE
 * Endpoint: /api/insurance/term-insurance/{id}/
 * Payload: None
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const deleteTermInsurance = async (id) => {
  try {
    const response = await api.delete(`/insurance/term-insurance/${id}/`);
    console.log("Delete Term Insurance Response:", response);
    return response;
  } catch (error) {
    console.error("Delete Term Insurance Error:", error);
    throw error;
  }
};

/**
 * Uploads a document for a term insurance
 * @param {number} id - Insurance ID
 * @param {File} file - Document file to upload
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/insurance/term-insurance/{id}/document/
 * Payload: {
 *   file: binary
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const uploadTermInsuranceDocument = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/insurance/term-insurance/${id}/document/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Upload Term Insurance Document Response:", response);
    return response;
  } catch (error) {
    console.error("Upload Term Insurance Document Error:", error);
    throw error;
  }
};