// @/lib/dashboard-api.js
import api from "./api";

//-----------------DASHBOARD APIs-------------------------

/**
 * Retrieves financial summary data
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/dashboard/financial/summary/
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: {
 *     net_worth: string,
 *     total_assets: string,
 *     total_liabilities: string
 *   }
 * }
 */
export const getFinancialSummary = async () => {
  try {
    const response = await api.get("/dashboard/financial/summary/");
    console.log("Get Financial Summary Response:", response);
    return response;
  } catch (error) {
    console.error("Get Financial Summary Error:", error);
    throw error;
  }
};

/**
 * Retrieves financial count data
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/dashboard/financial/count/
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: {
 *     bank_accounts: number,
 *     mutual_funds: number,
 *     stocks: number,
 *     deposits: number,
 *     fd_rd: number,
 *     demat_account: number
 *   }
 * }
 */
export const getFinancialCount = async () => {
  try {
    const response = await api.get("/dashboard/financial/count/");
    console.log("Get Financial Count Response:", response);
    return response;
  } catch (error) {
    console.error("Get Financial Count Error:", error);
    throw error;
  }
};

/**
 * Retrieves insurance overview data
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/dashboard/insurance/overview/
 * Output: {
 *   life_insurance: number,
 *   health_insurance: number,
 *   vehicle_insurance: number,
 *   travel_insurance: number,
 *   property_insurance: number
 * }
 */
export const getInsuranceOverview = async () => {
  try {
    const response = await api.get("/dashboard/insurance/overview/");
    console.log("Get Insurance Overview Response:", response);
    return response;
  } catch (error) {
    console.error("Get Insurance Overview Error:", error);
    throw error;
  }
};

/**
 * Retrieves nominee overview data
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/dashboard/nominee/overview/
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: [{
 *     nominee_id: number,
 *     first_name: string,
 *     last_name: string,
 *     relationship: string,
 *     asset_detail: [{
 *       asset: string,
 *       total_value: number
 *     }]
 *   }]
 * }
 */
export const getNomineeOverview = async () => {
  try {
    const response = await api.get("/dashboard/nominee/overview/");
    console.log("Get Nominee Overview Response:", response);
    return response;
  } catch (error) {
    console.error("Get Nominee Overview Error:", error);
    throw error;
  }
};