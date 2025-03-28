import api from "./api";

//-----------------NOTIFICATION APIs-------------------------

/**
 * Retrieves list of notifications
 * @param {Object} params - Query parameters for pagination
 * @returns {Promise} Response object
 * Request Type: GET
 * Endpoint: /api/notifiaction/
 * Parameters: {
 *   page: integer (default: 1)
 * }
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: [{
 *     count: integer,
 *     next_page: string,
 *     end: boolean,
 *     nootification: [{
 *       id: integer,
 *       created_at: string,
 *       updated_at: string,
 *       read: boolean,
 *       model: string,
 *       model_id: integer,
 *       message: string,
 *       action: string
 *     }]
 *   }]
 * }
 */
export const getNotifications = async (params = { page: 1 }) => {
  try {
    const response = await api.get("/notifiaction/", { params });
    console.log("Get Notifications Response:", response);
    return response;
  } catch (error) {
    console.error("Get Notifications Error:", error);
    throw error;
  }
};

/**
 * Marks a notification as read
 * @param {number} notificationId - The ID of the notification to mark as read
 * @returns {Promise} Response object
 * Request Type: POST
 * Endpoint: /api/notifiaction/read/{notification_id}
 * Payload: None (notification_id in path)
 * Output: {
 *   status: boolean,
 *   message: string,
 *   data: {}
 * }
 */
export const readNotification = async (notificationId) => {
  try {
    const response = await api.post(`/notifiaction/read/${notificationId}`);
    console.log("Read Notification Response:", response);
    return response;
  } catch (error) {
    console.error("Read Notification Error:", error);
    throw error;
  }
};
