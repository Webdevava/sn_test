// @/lib/mutual-fund-api.js
import api from "./api";

//-----------------MUTUAL FUND APIs-------------------------

/**
 * Creates an already held mutual fund
 * @param {Object} mutualFundData - Mutual fund details
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/securitymutual-fund/already-held/
 * Payload: {
 *   fund_name: string,
 *   invested_amount: number,
 *   units: number,
 *   fund_type: string ("Equity" | etc.),
 *   folio_number: string,
 *   categroy: string ("Already Invested"),
 *   frequency: string ("Other" | etc.)
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const createAlreadyHeldMutualFund = async (mutualFundData) => {
  try {
    const response = await api.post("/securitymutual-fund/already-held/", mutualFundData);
    console.log("Create Already Held Mutual Fund Response:", response);
    return response;
  } catch (error) {
    console.error("Create Already Held Mutual Fund Error:", error);
    throw error;
  }
};

/**
 * Creates a recurring mutual fund
 * @param {Object} mutualFundData - Mutual fund details
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/securitymutual-fund/recurring/
 * Payload: {
 *   fund_name: string,
 *   invested_amount: null,
 *   units: number,
 *   fund_type: string ("Equity" | etc.),
 *   folio_number: null,
 *   categroy: string ("Recurring"),
 *   frequency: string ("SIP" | etc.),
 *   sip_amount: number,
 *   sip_frequency: string ("Monthly" | etc.),
 *   sip_date: string
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const createRecurringMutualFund = async (mutualFundData) => {
  try {
    const response = await api.post("/securitymutual-fund/recurring/", mutualFundData);
    console.log("Create Recurring Mutual Fund Response:", response);
    return response;
  } catch (error) {
    console.error("Create Recurring Mutual Fund Error:", error);
    throw error;
  }
};

/**
 * Updates an already held mutual fund
 * @param {number} id - The ID of the mutual fund to update
 * @param {Object} mutualFundData - Updated mutual fund details
 * @returns {Promise} Response object
 * Request Type: PUT
 * Endpoint: /api/securitymutual-fund/{id}/already-held/
 * Payload: {
 *   fund_name: string,
 *   invested_amount: number,
 *   units: number,
 *   fund_type: string ("Equity" | etc.),
 *   folio_number: string,
 *   categroy: string ("Recurring" | etc.),
 *   frequency: string ("SIP" | etc.)
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const updateAlreadyHeldMutualFund = async (id, mutualFundData) => {
  try {
    const response = await api.put(`/securitymutual-fund/${id}/already-held/`, mutualFundData);
    console.log("Update Already Held Mutual Fund Response:", response);
    return response;
  } catch (error) {
    console.error("Update Already Held Mutual Fund Error:", error);
    throw error;
  }
};

/**
 * Updates a recurring mutual fund
 * @param {number} id - The ID of the mutual fund to update
 * @param {Object} mutualFundData - Updated mutual fund details
 * @returns {Promise} Response object
 * Request Type: PUT
 * Endpoint: /api/securitymutual-fund/{id}/recurring/
 * Payload: Same as createRecurringMutualFund (assumed from context)
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const updateRecurringMutualFund = async (id, mutualFundData) => {
  try {
    const response = await api.put(`/securitymutual-fund/${id}/recurring/`, mutualFundData);
    console.log("Update Recurring Mutual Fund Response:", response);
    return response;
  } catch (error) {
    console.error("Update Recurring Mutual Fund Error:", error);
    throw error;
  }
};

/**
 * Deletes a mutual fund
 * @param {number} id - The ID of the mutual fund to delete
 * @returns {Promise} Response object
 * Request Type: DELETE
 * Endpoint: /api/securitymutual-fund/{id}/
 * Payload: None
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const deleteMutualFund = async (id) => {
  try {
    const response = await api.delete(`/securitymutual-fund/${id}/`);
    console.log("Delete Mutual Fund Response:", response);
    return response;
  } catch (error) {
    console.error("Delete Mutual Fund Error:", error);
    throw error;
  }
};

/**
 * Retrieves list of mutual funds
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/securitymutual-fund/
 * Payload: None
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const listMutualFunds = async () => {
  try {
    const response = await api.get("/securitymutual-fund/");
    console.log("List Mutual Funds Response:", response);
    return response;
  } catch (error) {
    console.error("List Mutual Funds Error:", error);
    throw error;
  }
};