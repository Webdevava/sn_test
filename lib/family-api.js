// @/lib/family-api.js
import api from "./api";

//-----------------FAMILY APIs-------------------------

/**
 * Creates a new family member
 * @param {Object} familyData - Family member details
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/family/family-member/
 * Payload: {
 *   first_name: string,
 *   last_name: string,
 *   relationship: string,
 *   dob: string (YYYY-MM-DD),
 *   gender: string ("male" | "female" | etc.),
 *   email: string,
 *   phone_number: string,
 *   adhaar_number: string
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const createFamilyMember = async (familyData) => {
  try {
    const response = await api.post("/family/family-member/", familyData);
    console.log("Create Family Member Response:", response);
    return response;
  } catch (error) {
    console.error("Create Family Member Error:", error);
    throw error;
  }
};

/**
 * Retrieves list of family members with optional filters
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/family/family-list/
 * Filters: {
 *   relationship: string | null,
 *   sort: string | null (default: "first_name"),
 *   order: string | null (default: "asc")
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const listFamilyMembers = async (params = {}) => {
  try {
    const response = await api.get("/family/family-list/", { params });
    console.log("List Family Members Response:", response);
    return response;
  } catch (error) {
    console.error("List Family Members Error:", error);
    throw error;
  }
};

/**
 * Retrieves details of a specific family member
 * @param {number} familyMemberId - The ID of the family member
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/family/member-detail/{famil_member_id}/
 * Payload: None (family_member_id in path)
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: {
 *     id: integer,
 *     first_name: string,
 *     last_name: string,
 *     relationship: string,
 *     dob: string,
 *     gender: string,
 *     adhaar_number: string,
 *     email: string,
 *     phone_number: string,
 *     address: array
 *   }
 * }
 */
export const getFamilyMemberDetail = async (familyMemberId) => {
  try {
    const response = await api.get(`/family/member-detail/${familyMemberId}/`);
    console.log("Get Family Member Detail Response:", response);
    return response;
  } catch (error) {
    console.error("Get Family Member Detail Error:", error);
    throw error;
  }
};

/**
 * Updates an existing family member
 * @param {number} familyMemberId - The ID of the family member to update
 * @param {Object} familyData - Updated family member details
 * @returns {Promise} Response object
 * Request Type: PUT
 * Endpoint: /api/family/family-member/{family_member_id}/
 * Payload: {
 *   first_name: string,
 *   last_name: string,
 *   relationship: string,
 *   dob: string (YYYY-MM-DD),
 *   gender: string ("male" | "female" | etc.),
 *   email: string,
 *   phone_number: string,
 *   adhaar_number: string
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const updateFamilyMember = async (familyMemberId, familyData) => {
  try {
    const response = await api.put(`/family/family-member/${familyMemberId}/`, familyData);
    console.log("Update Family Member Response:", response);
    return response;
  } catch (error) {
    console.error("Update Family Member Error:", error);
    throw error;
  }
};

/**
 * Deletes a family member
 * @param {number} memberId - The ID of the family member to delete
 * @returns {Promise} Response object
 * Request Type: DELETE
 * Endpoint: /api/family/family-member/{member_id}/
 * Payload: None (member_id in path)
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const deleteFamilyMember = async (memberId) => {
  try {
    const response = await api.delete(`/family/family-member/${memberId}/`);
    console.log("Delete Family Member Response:", response);
    return response;
  } catch (error) {
    console.error("Delete Family Member Error:", error);
    throw error;
  }
};

/**
 * Retrieves list of distinct relationship values for the authenticated user
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/family/relation-list/
 * Payload: None
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const getRelationList = async () => {
  try {
    const response = await api.get("/family/relation-list/");
    console.log("Get Relation List Response:", response);
    return response;
  } catch (error) {
    console.error("Get Relation List Error:", error);
    throw error;
  }
};