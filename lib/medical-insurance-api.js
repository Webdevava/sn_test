// @/lib/medical-insurance-api.js
import api from "./api";

//-----------------MEDICAL INSURANCE APIs-------------------------

/**
 * Creates a new medical insurance
 * @param {Object} insuranceData - Medical insurance details
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/insurance/medical-insurance/
 * Payload: {
 *   policy_name: string,
 *   policy_number: string,
 *   policy_type: string,
 *   insurer_name: string,
 *   sum_insured: number,
 *   premium_amount: number,
 *   policy_term: number,
 *   maturity_date: string ("YYYY-MM-DD"),
 *   start_date: string ("YYYY-MM-DD"),
 *   linked_mobile: string,
 *   coverage_details: string[]
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const createMedicalInsurance = async (insuranceData) => {
  try {
    const response = await api.post("/insurance/medical-insurance/", insuranceData);
    console.log("Create Medical Insurance Response:", response);
    return response;
  } catch (error) {
    console.error("Create Medical Insurance Error:", error);
    throw error;
  }
};

/**
 * Retrieves list of medical insurances
 * @param {Object} params - Query parameters for sorting
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/insurance/list-medical-insurance/
 * Query Params: {
 *   sort_by: string | null,
 *   order: string | null ("asc" | "desc")
 * }
 * Output: {
 *   data: []
 * }
 */
export const listMedicalInsurances = async (params = {}) => {
  try {
    const response = await api.get("/insurance/list-medical-insurance/", { params });
    console.log("List Medical Insurances Response:", response);
    return response;
  } catch (error) {
    console.error("List Medical Insurances Error:", error);
    throw error;
  }
};

/**
 * Retrieves details of a specific medical insurance
 * @param {number} id - Insurance ID
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/insurance/medical-insurance/{id}/
 * Output: {
 *   data: {
 *     policy_name: string,
 *     policy_number: string,
 *     policy_type: string,
 *     insurer_name: string,
 *     sum_insured: string,
 *     premium_amount: string,
 *     policy_term: number,
 *     maturity_date: string,
 *     start_date: string,
 *     linked_mobile: string,
 *     coverage_details: string[],
 *     nominee: Array
 *   }
 * }
 */
export const getMedicalInsuranceDetail = async (id) => {
  try {
    const response = await api.get(`/insurance/medical-insurance/${id}/`);
    console.log("Get Medical Insurance Detail Response:", response);
    return response;
  } catch (error) {
    console.error("Get Medical Insurance Detail Error:", error);
    throw error;
  }
};

/**
 * Updates a medical insurance
 * @param {number} id - Insurance ID
 * @param {Object} insuranceData - Updated insurance details
 * @returns {Promise} Response object
 * Request Type: PUT
 * Endpoint: /api/insurance/medical-insurance/{id}/
 * Payload: Same as createMedicalInsurance
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const updateMedicalInsurance = async (id, insuranceData) => {
  try {
    const response = await api.put(`/insurance/medical-insurance/${id}/`, insuranceData);
    console.log("Update Medical Insurance Response:", response);
    return response;
  } catch (error) {
    console.error("Update Medical Insurance Error:", error);
    throw error;
  }
};

/**
 * Deletes a medical insurance
 * @param {number} id - Insurance ID
 * @returns {Promise} Response object
 * Request Type: DELETE
 * Endpoint: /api/insurance/medical-insurance/{id}/
 * Payload: None
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const deleteMedicalInsurance = async (id) => {
  try {
    const response = await api.delete(`/insurance/medical-insurance/${id}/`);
    console.log("Delete Medical Insurance Response:", response);
    return response;
  } catch (error) {
    console.error("Delete Medical Insurance Error:", error);
    throw error;
  }
};

/**
 * Uploads a document for a medical insurance
 * @param {number} id - Insurance ID
 * @param {File} file - Document file to upload
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/insurance/medical-insurance/{id}/document/
 * Payload: {
 *   file: binary
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const uploadMedicalInsuranceDocument = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/insurance/medical-insurance/${id}/document/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Upload Medical Insurance Document Response:", response);
    return response;
  } catch (error) {
    console.error("Upload Medical Insurance Document Error:", error);
    throw error;
  }
};