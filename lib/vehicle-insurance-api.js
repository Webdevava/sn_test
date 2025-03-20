// @/lib/vehicle-insurance-api.js
import api from "./api";

//-----------------VEHICLE INSURANCE APIs-------------------------

/**
 * Creates a new vehicle insurance
 * @param {Object} insuranceData - Vehicle insurance details
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/insurance/vehicle-insurance/
 * Payload: {
 *   vehicle_type: string,
 *   policy_number: string,
 *   insurer_name: string,
 *   premium_amount: number,
 *   sum_insured: number,
 *   policy_term: number,
 *   start_date: string ("YYYY-MM-DD"),
 *   expiry_date: string ("YYYY-MM-DD"),
 *   linked_mobile: string,
 *   vehicle_registration_number: string,
 *   coverage_details: string
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const createVehicleInsurance = async (insuranceData) => {
  try {
    const response = await api.post("/insurance/vehicle-insurance/", insuranceData);
    console.log("Create Vehicle Insurance Response:", response);
    return response;
  } catch (error) {
    console.error("Create Vehicle Insurance Error:", error);
    throw error;
  }
};

/**
 * Retrieves list of vehicle insurances
 * @param {Object} params - Query parameters for sorting
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/insurance/vehicle-insurance/
 * Query Params: {
 *   sort_by: string | null ("expiry_date" default),
 *   order: string | null ("asc" | "desc")
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const listVehicleInsurances = async (params = {}) => {
  try {
    const response = await api.get("/insurance/vehicle-insurance/", { params });
    console.log("List Vehicle Insurances Response:", response);
    return response;
  } catch (error) {
    console.error("List Vehicle Insurances Error:", error);
    throw error;
  }
};

/**
 * Retrieves details of a specific vehicle insurance
 * @param {number} id - Insurance ID
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/insurance/vehicle-insurance/{id}/
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: {
 *     id: number,
 *     created_at: string,
 *     updated_at: string,
 *     vehicle_type: string,
 *     policy_number: string,
 *     insurer_name: string,
 *     premium_amount: string,
 *     sum_insured: string,
 *     policy_term: number,
 *     start_date: string,
 *     expiry_date: string,
 *     linked_mobile: string,
 *     vehicle_registration_number: string,
 *     coverage_details: string,
 *     document: string,
 *     nominee: Array
 *   }
 * }
 */
export const getVehicleInsuranceDetail = async (id) => {
  try {
    const response = await api.get(`/insurance/vehicle-insurance/${id}/`);
    console.log("Get Vehicle Insurance Detail Response:", response);
    return response;
  } catch (error) {
    console.error("Get Vehicle Insurance Detail Error:", error);
    throw error;
  }
};

/**
 * Updates a vehicle insurance
 * @param {number} id - Insurance ID
 * @param {Object} insuranceData - Updated insurance details
 * @returns {Promise} Response object
 * Request Type: PUT
 * Endpoint: /api/insurance/vehicle-insurance/{id}/
 * Payload: Same as createVehicleInsurance with optional coverage_detail array
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const updateVehicleInsurance = async (id, insuranceData) => {
  try {
    const response = await api.put(`/insurance/vehicle-insurance/${id}/`, insuranceData);
    console.log("Update Vehicle Insurance Response:", response);
    return response;
  } catch (error) {
    console.error("Update Vehicle Insurance Error:", error);
    throw error;
  }
};

/**
 * Deletes a vehicle insurance
 * @param {number} id - Insurance ID
 * @returns {Promise} Response object
 * Request Type: DELETE
 * Endpoint: /api/insurance/vehicle-insurance/{id}/
 * Payload: None
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const deleteVehicleInsurance = async (id) => {
  try {
    const response = await api.delete(`/insurance/vehicle-insurance/${id}/`);
    console.log("Delete Vehicle Insurance Response:", response);
    return response;
  } catch (error) {
    console.error("Delete Vehicle Insurance Error:", error);
    throw error;
  }
};

/**
 * Uploads a document for a vehicle insurance
 * @param {number} id - Insurance ID
 * @param {File} file - Document file to upload
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/insurance/vehicle-insurance/{id}/document/
 * Payload: {
 *   file: binary
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const uploadVehicleInsuranceDocument = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/insurance/vehicle-insurance/${id}/document/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Upload Vehicle Insurance Document Response:", response);
    return response;
  } catch (error) {
    console.error("Upload Vehicle Insurance Document Error:", error);
    throw error;
  }
};