// @/lib/document-api.js
import api from "./api";

//-----------------DOCUMENT APIs-------------------------

/**
 * Creates a new document
 * @param {Object} documentData - Document details
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/document/add/
 * Payload: {
 *   document_type: string,
 *   document_number: string,
 *   issue_date: string (YYYY-MM-DD),
 *   expiry_date: string (YYYY-MM-DD),
 *   extra_data: object
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const createDocument = async (documentData) => {
  try {
    const response = await api.post("/document/add/", documentData);
    console.log("Create Document Response:", response);
    return response;
  } catch (error) {
    console.error("Create Document Error:", error);
    throw error;
  }
};

/**
 * Updates an existing document
 * @param {number} id - The ID of the document to update
 * @param {Object} documentData - Updated document details
 * @returns {Promise} Response object
 * Request Type: PUT
 * Endpoint: /api/document/edit/{id}/
 * Payload: {
 *   document_number: string,
 *   issue_date: string (YYYY-MM-DD),
 *   expiry_date: string (YYYY-MM-DD),
 *   extra_data: object
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const updateDocument = async (id, documentData) => {
  try {
    const response = await api.put(`/document/edit/${id}/`, documentData);
    console.log("Update Document Response:", response);
    return response;
  } catch (error) {
    console.error("Update Document Error:", error);
    throw error;
  }
};

/**
 * Deletes a document
 * @param {number} id - The ID of the document to delete
 * @returns {Promise} Response object
 * Request Type: DELETE
 * Endpoint: /api/document/delete/{id}/
 * Payload: None
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const deleteDocument = async (id) => {
  try {
    const response = await api.delete(`/document/delete/${id}/`);
    console.log("Delete Document Response:", response);
    return response;
  } catch (error) {
    console.error("Delete Document Error:", error);
    throw error;
  }
};

/**
 * Retrieves list of all documents
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/document/
 * Payload: None
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const listDocuments = async () => {
  try {
    const response = await api.get("/document/");
    console.log("List Documents Response:", response);
    return response;
  } catch (error) {
    console.error("List Documents Error:", error);
    throw error;
  }
};

/**
 * Retrieves details of a specific document
 * @param {number} id - The ID of the document
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/document/{id}/
 * Payload: None
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: {}
 * }
 */
export const getDocumentDetail = async (id) => {
  try {
    const response = await api.get(`/document/${id}/`);
    console.log("Get Document Detail Response:", response);
    return response;
  } catch (error) {
    console.error("Get Document Detail Error:", error);
    throw error;
  }
};

/**
 * Uploads attachments to a document
 * @param {number} documentId - The ID of the document
 * @param {File[]} files - Array of files to upload
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/document/{document_id}/attachments/
 * Payload: FormData with files (array<string>)
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const uploadDocumentAttachments = async (documentId, files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const response = await api.post(`/document/${documentId}/attachments/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Upload Document Attachments Response:", response);
    return response;
  } catch (error) {
    console.error("Upload Document Attachments Error:", error);
    throw error;
  }
};

/**
 * Deletes a document attachment
 * @param {number} documentId - The ID of the document
 * @param {number} attachmentId - The ID of the attachment to delete
 * @returns {Promise} Response object
 * Request Type: DELETE
 * Endpoint: /api/document/{document_id}/attachments/{attachment_id}/
 * Payload: None
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: []
 * }
 */
export const deleteDocumentAttachment = async (documentId, attachmentId) => {
  try {
    const response = await api.delete(`/document/${documentId}/attachments/${attachmentId}/`);
    console.log("Delete Document Attachment Response:", response);
    return response;
  } catch (error) {
    console.error("Delete Document Attachment Error:", error);
    throw error;
  }
};