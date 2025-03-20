// @/lib/stock-api.js
import api from "./api";

//-----------------STOCK APIs-------------------------

/**
 * Retrieves list of stocks
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/security/stocks/
 * Payload: None
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const listStocks = async () => {
  try {
    const response = await api.get("/security/stocks/");
    console.log("List Stocks Response:", response);
    return response;
  } catch (error) {
    console.error("List Stocks Error:", error);
    throw error;
  }
};

/**
 * Creates a new stock
 * @param {Object} stockData - Stock details
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/security/stocks/
 * Payload: {
 *   demat_account: integer,
 *   stock_name: string,
 *   stock_exchange: string,
 *   quantity: integer,
 *   purchase_price: number,
 *   purchase_date: string,
 *   current_price: number,
 *   total_investment: number
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const createStock = async (stockData) => {
  try {
    const response = await api.post("/security/stocks/", stockData);
    console.log("Create Stock Response:", response);
    return response;
  } catch (error) {
    console.error("Create Stock Error:", error);
    throw error;
  }
};

/**
 * Updates an existing stock
 * @param {number} id - The ID of the stock to update
 * @param {Object} stockData - Updated stock details
 * @returns {Promise} Response object
 * Request Type: PUT
 * Endpoint: /api/security/stocks/{id}/
 * Payload: {
 *   demat_account: integer,
 *   stock_name: string,
 *   stock_exchange: string,
 *   quantity: integer,
 *   purchase_price: number,
 *   purchase_date: string,
 *   current_price: number,
 *   total_investment: number
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const updateStock = async (id, stockData) => {
  try {
    const response = await api.put(`/security/stocks/${id}/`, stockData);
    console.log("Update Stock Response:", response);
    return response;
  } catch (error) {
    console.error("Update Stock Error:", error);
    throw error;
  }
};

/**
 * Deletes a stock
 * @param {number} id - The ID of the stock to delete
 * @returns {Promise} Response object
 * Request Type: DELETE
 * Endpoint: /api/security/stocks/{id}/
 * Payload: None
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const deleteStock = async (id) => {
  try {
    const response = await api.delete(`/security/stocks/${id}/`);
    console.log("Delete Stock Response:", response);
    return response;
  } catch (error) {
    console.error("Delete Stock Error:", error);
    throw error;
  }
};