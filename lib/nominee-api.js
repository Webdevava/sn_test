// @/lib/nominee-api.js
import api from "./api";

//-----------------NOMINEE APIs-------------------------

/**
 * Creates a new nominee for an asset
 * @param {string} assetType - The type of asset (e.g., "bank", "deposit", etc.)
 * @param {Object} nomineeData - Nominee details
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/nominee/{asset_type}/
 * Payload: {
 *   nominee_id: integer,
 *   percentage: integer,
 *   asset_id: integer
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const createNominee = async (assetType, nomineeData) => {
  try {
    const response = await api.post(`/nominee/${assetType}/`, nomineeData);
    console.log("Create Nominee Response:", response);
    return response;
  } catch (error) {
    console.error("Create Nominee Error:", error);
    throw error;
  }
};

/**
 * Updates an existing nominee
 * @param {string} assetType - The type of asset (e.g., "bank", "deposit", etc.)
 * @param {number} assetNomineeId - The ID of the nominee to update
 * @param {Object} nomineeData - Updated nominee details
 * @returns {Promise} Response object
 * Request Type: PUT
 * Endpoint: /api/nominee/{asset_type}/{asset_nominne_id}/
 * Payload: {
 *   percentage: integer
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const updateNominee = async (assetType, assetNomineeId, nomineeData) => {
  try {
    const response = await api.put(`/nominee/${assetType}/${assetNomineeId}/`, nomineeData);
    console.log("Update Nominee Response:", response);
    return response;
  } catch (error) {
    console.error("Update Nominee Error:", error);
    throw error;
  }
};

/**
 * Deletes a nominee
 * @param {string} assetType - The type of asset (e.g., "bank", "deposit", etc.)
 * @param {number} assetNomineeId - The ID of the nominee to delete
 * @returns {Promise} Response object
 * Request Type: DELETE
 * Endpoint: /api/nominee/{asset_type}/{asset_nominne_id}/
 * Payload: None
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const deleteNominee = async (assetType, assetNomineeId) => {
  try {
    const response = await api.delete(`/nominee/${assetType}/${assetNomineeId}/`);
    console.log("Delete Nominee Response:", response);
    return response;
  } catch (error) {
    console.error("Delete Nominee Error:", error);
    throw error;
  }
};