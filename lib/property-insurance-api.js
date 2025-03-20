// @/lib/property-insurance-api.js
import api from "./api";

//-----------------PROPERTY INSURANCE APIs-------------------------

/**
 * Creates a new property insurance
 * @param {Object} insuranceData - Property insurance details
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/insurance/property-insurance/
 * Payload: {
 *   policy_type: string,
 *   policy_number: string,
 *   insurer_name: string,
 *   premium_amount: number,
 *   sum_insured: number,
 *   property_address: string,
 *   policy_term: number,
 *   policy_start_date: string ("YYYY-MM-DD"),
 *   policy_expiry_date: string ("YYYY-MM-DD"),
 *   linked_mobile: string
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const createPropertyInsurance = async (insuranceData) => {
  try {
    const response = await api.post("/insurance/property-insurance/", insuranceData);
    console.log("Create Property Insurance Response:", response);
    return response;
  } catch (error) {
    console.error("Create Property Insurance Error:", error);
    throw error;
  }
};

/**
 * Retrieves list of property insurances
 * @param {Object} params - Query parameters for sorting
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/insurance/property-insurance/
 * Query Params: {
 *   sort_by: string | null ("policy_expiry_date" default),
 *   order: string | null ("asc" | "desc")
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const listPropertyInsurances = async (params = {}) => {
  try {
    const response = await api.get("/insurance/property-insurance/", { params });
    console.log("List Property Insurances Response:", response);
    return response;
  } catch (error) {
    console.error("List Property Insurances Error:", error);
    throw error;
  }
};

/**
 * Retrieves details of a specific property insurance
 * @param {number} id - Insurance ID
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/insurance/property-insurance/{id}/
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: {
 *     id: number,
 *     created_at: string,
 *     updated_at: string,
 *     policy_type: string,
 *     policy_number: string,
 *     insurer_name: string,
 *     premium_amount: string,
 *     sum_insured: string,
 *     property_address: string,
 *     policy_term: number,
 *     policy_start_date: string,
 *     policy_expiry_date: string,
 *     linked_mobile: string,
 *     document: string,
 *     nominee: Array
 *   }
 * }
 */
export const getPropertyInsuranceDetail = async (id) => {
  try {
    const response = await api.get(`/insurance/property-insurance/${id}/`);
    console.log("Get Property Insurance Detail Response:", response);
    return response;
  } catch (error) {
    console.error("Get Property Insurance Detail Error:", error);
    throw error;
  }
};

/**
 * Updates a property insurance
 * @param {number} id - Insurance ID
 * @param {Object} insuranceData - Updated insurance details
 * @returns {Promise} Response object
 * Request Type: PUT
 * Endpoint: /api/insurance/property-insurance/{id}/
 * Payload: Same as createPropertyInsurance
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const updatePropertyInsurance = async (id, insuranceData) => {
  try {
    const response = await api.put(`/insurance/property-insurance/${id}/`, insuranceData);
    console.log("Update Property Insurance Response:", response);
    return response;
  } catch (error) {
    console.error("Update Property Insurance Error:", error);
    throw error;
  }
};

/**
 * Deletes a property insurance
 * @param {number} id - Insurance ID
 * @returns {Promise} Response object
 * Request Type: DELETE
 * Endpoint: /api/insurance/property-insurance/{id}/
 * Payload: None
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const deletePropertyInsurance = async (id) => {
  try {
    const response = await api.delete(`/insurance/property-insurance/${id}/`);
    console.log("Delete Property Insurance Response:", response);
    return response;
  } catch (error) {
    console.error("Delete Property Insurance Error:", error);
    throw error;
  }
};

/**
 * Uploads a document for a property insurance
 * @param {number} id - Insurance ID
 * @param {File} file - Document file to upload
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/insurance/property-insurance/{id}/document/
 * Payload: {
 *   file: binary
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const uploadPropertyInsuranceDocument = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/insurance/property-insurance/${id}/document/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Upload Property Insurance Document Response:", response);
    return response;
  } catch (error) {
    console.error("Upload Property Insurance Document Error:", error);
    throw error;
  }
};