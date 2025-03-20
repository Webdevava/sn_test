// @/lib/travel-insurance-api.js
import api from "./api";

//-----------------TRAVEL INSURANCE APIs-------------------------

/**
 * Creates a new travel insurance
 * @param {Object} insuranceData - Travel insurance details
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/insurance/travel-insurance/
 * Payload: {
 *   travel_type: string,
 *   policy_number: string,
 *   insurer_name: string,
 *   premium_amount: number,
 *   sum_insured: number,
 *   policy_start_date: string ("YYYY-MM-DD"),
 *   policy_expiry_date: string ("YYYY-MM-DD"),
 *   linked_mobile: string,
 *   coverage_details: string
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const createTravelInsurance = async (insuranceData) => {
  try {
    const response = await api.post("/insurance/travel-insurance/", insuranceData);
    console.log("Create Travel Insurance Response:", response);
    return response;
  } catch (error) {
    console.error("Create Travel Insurance Error:", error);
    throw error;
  }
};

/**
 * Retrieves list of travel insurances
 * @param {Object} params - Query parameters for sorting
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/insurance/travel-insurance/
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
export const listTravelInsurances = async (params = {}) => {
  try {
    const response = await api.get("/insurance/travel-insurance/", { params });
    console.log("List Travel Insurances Response:", response);
    return response;
  } catch (error) {
    console.error("List Travel Insurances Error:", error);
    throw error;
  }
};

/**
 * Uploads a document for a travel insurance
 * @param {number} id - Insurance ID
 * @param {File} file - Document file to upload
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/insurance/travel-insurance/{id}/document/
 * Payload: {
 *   file: binary
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const uploadTravelInsuranceDocument = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/insurance/travel-insurance/${id}/document/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Upload Travel Insurance Document Response:", response);
    return response;
  } catch (error) {
    console.error("Upload Travel Insurance Document Error:", error);
    throw error;
  }
};

/**
 * Deletes a travel insurance record
 * @param {number} id - Insurance ID to delete
 * @returns {Promise} Response object
 * Request Type: DELETE
 * Endpoint: /api/insurance/travel-insurance/{id}/
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const deleteTravelInsurance = async (id) => {
  try {
    const response = await api.delete(`/insurance/travel-insurance/${id}/`);
    console.log("Delete Travel Insurance Response:", response);
    return response;
  } catch (error) {
    console.error("Delete Travel Insurance Error:", error);
    throw error;
  }
};

/**
 * Updates an existing travel insurance record
 * @param {number} id - Insurance ID to update
 * @param {Object} insuranceData - Updated travel insurance details
 * @returns {Promise} Response object
 * Request Type: PUT
 * Endpoint: /api/insurance/travel-insurance/{id}/
 * Payload: {
 *   travel_type: string,
 *   policy_number: string,
 *   insurer_name: string,
 *   premium_amount: number,
 *   sum_insured: number,
 *   policy_start_date: string ("YYYY-MM-DD"),
 *   policy_expiry_date: string ("YYYY-MM-DD"),
 *   linked_mobile: string,
 *   coverage_details: string,
 *   coverage_detail: string[]
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const updateTravelInsurance = async (id, insuranceData) => {
  try {
    const response = await api.put(`/insurance/travel-insurance/${id}/`, insuranceData);
    console.log("Update Travel Insurance Response:", response);
    return response;
  } catch (error) {
    console.error("Update Travel Insurance Error:", error);
    throw error;
  }
};

/**
 * Retrieves details of a specific travel insurance
 * @param {number} id - Insurance ID to retrieve
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/insurance/travel-insurance/{id}/
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: {
 *     id: number,
 *     created_at: string,
 *     updated_at: string,
 *     travel_type: string,
 *     policy_number: string,
 *     insurer_name: string,
 *     premium_amount: string,
 *     sum_insured: string,
 *     policy_start_date: string,
 *     policy_expiry_date: string,
 *     linked_mobile: string,
 *     coverage_details: string,
 *     document: string,
 *     nominee: [{
 *       first_name: string,
 *       last_name: string,
 *       relationship: string,
 *       percentage: number,
 *       version: number,
 *       id: number
 *     }]
 *   }
 * }
 */
export const getTravelInsuranceDetails = async (id) => {
  try {
    const response = await api.get(`/insurance/travel-insurance/${id}/`);
    console.log("Get Travel Insurance Details Response:", response);
    return response;
  } catch (error) {
    console.error("Get Travel Insurance Details Error:", error);
    throw error;
  }
};