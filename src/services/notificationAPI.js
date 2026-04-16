/**
 * Notification API Service
 * Handles all notification-related API calls
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const NOTIFICATIONS_ENDPOINT = `${API_BASE_URL}/notifications`;

// Get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Enhanced error handler
const handleError = (error, endpoint) => {
  const errorData = error.response?.data;
  const status = error.response?.status;
  
  console.error(`API Error [${endpoint}]:`, {
    status,
    data: errorData,
    message: error.message,
  });
  
  // If DRF returned structured validation errors (e.g. {field: ["msg"]}),
  // unwrap the first message so the UI doesn't show the generic fallback.
  if (errorData) {
    if (
      typeof errorData === 'object' &&
      !Array.isArray(errorData) &&
      Object.keys(errorData).length > 0
    ) {
      const firstKey = Object.keys(errorData)[0];
      const firstVal = errorData[firstKey];
      const detail = Array.isArray(firstVal) ? firstVal.join(' ') : firstVal;
      return { detail };
    }
    return { detail: error.message || 'An error occurred' };
  }
  return { detail: error.message || 'An error occurred' };
};

export const notificationAPI = {
  /**
   * Get user's notifications
   * @param {Object} filters - Filter options (status, notification_type, page)
   */
  getNotifications: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.notification_type) params.append('notification_type', filters.notification_type);
      if (filters.page) params.append('page', filters.page);
      if (filters.search) params.append('search', filters.search);
      if (filters.ordering) params.append('ordering', filters.ordering);

      const response = await axios.get(`${NOTIFICATIONS_ENDPOINT}/`, {
        params,
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw handleError(error, 'getNotifications');
    }
  },

  /**
   * Get user notifications (alternative endpoint)
   */
  getUserNotifications: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.notification_type) params.append('notification_type', filters.notification_type);

      const response = await axios.get(`${NOTIFICATIONS_ENDPOINT}/user_notifications/`, {
        params,
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw handleError(error, 'getUserNotifications');
    }
  },

  /**
   * Get notification by ID
   * @param {number} id - Notification ID
   */
  getNotificationById: async (id) => {
    try {
      const response = await axios.get(`${NOTIFICATIONS_ENDPOINT}/${id}/`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw handleError(error, 'getNotificationById');
    }
  },

  /**
   * Send a notification
   * @param {Object} notificationData - Notification data
   * @param {string} notificationData.notification_type - Type of notification
   * @param {string} notificationData.phone_number - Phone number (optional, uses user's phone)
   * @param {string} notificationData.message - Custom message (optional)
   */
  sendNotification: async (notificationData) => {
    try {
      // channel can be INCLUDED (SMS/WHATSAPP); backend defaults to SMS
      const response = await axios.post(
        `${NOTIFICATIONS_ENDPOINT}/send_notification/`,
        notificationData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw handleError(error, 'sendNotification');
    }
  },

  /**
   * ADMIN: Send notification to a specific user
   * @param {Object} payload
   * @param {number} payload.user_id
   * @param {string} payload.notification_type
   * @param {string} [payload.message]
   * @param {string} [payload.phone_number] - optional override
   */
  adminSendNotification: async (payload) => {
    try {
      // payload may include `channel` key to select SMS/WHATSAPP
      const response = await axios.post(
        `${NOTIFICATIONS_ENDPOINT}/admin_send/`,
        payload,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw handleError(error, 'adminSendNotification');
    }
  },

  /**
   * Send verification code to user's phone_number
   * @param {string} phone_number
   */
  sendVerificationCode: async (phone_number) => {
    try {
      const response = await axios.post(
        `${NOTIFICATIONS_ENDPOINT}/send_verification_code/`,
        { phone_number },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw handleError(error, 'sendVerificationCode');
    }
  },

  /**
   * Verify phone with code
   * @param {string} code
   */
  verifyPhone: async (code) => {
    try {
      const response = await axios.post(
        `${NOTIFICATIONS_ENDPOINT}/verify_phone/`,
        { code },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw handleError(error, 'verifyPhone');
    }
  },

  /**
   * Retry sending a failed notification
   * @param {number} id - Notification ID
   */
  retryNotification: async (id) => {
    try {
      const response = await axios.patch(
        `${NOTIFICATIONS_ENDPOINT}/${id}/retry_send/`,
        {},
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw handleError(error, 'retryNotification');
    }
  },

  /**
   * Get notification statistics
   */
  getStatistics: async () => {
    try {
      const response = await axios.get(`${NOTIFICATIONS_ENDPOINT}/statistics/`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw handleError(error, 'getStatistics');
    }
  },

  /**
   * Clear old notifications (older than 30 days)
   */
  clearOldNotifications: async () => {
    try {
      const response = await axios.delete(`${NOTIFICATIONS_ENDPOINT}/clear_old/`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw handleError(error, 'clearOldNotifications');
    }
  },

  /**
   * Mark notification as read (if backend supports it)
   * Note: This is a placeholder - backend may need to add this endpoint
   */
  markAsRead: async (id) => {
    try {
      const response = await axios.patch(
        `${NOTIFICATIONS_ENDPOINT}/${id}/`,
        { is_read: true },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw handleError(error, 'markAsRead');
    }
  },
};

// Notification channel constants
export const NOTIFICATION_CHANNELS = {
  SMS: 'SMS',
  WHATSAPP: 'WHATSAPP',
};

// Notification types constants
export const NOTIFICATION_TYPES = {
  BOOKING_CONFIRMATION: 'BOOKING_CONFIRMATION',
  BOOKING_APPROVED: 'BOOKING_APPROVED',
  BOOKING_REJECTED: 'BOOKING_REJECTED',
  PAYMENT_REMINDER: 'PAYMENT_REMINDER',
  VEHICLE_RETURNED: 'VEHICLE_RETURNED',
  VERIFICATION_CODE: 'VERIFICATION_CODE',
  GENERAL_ALERT: 'GENERAL_ALERT',
};

// Notification status constants
export const NOTIFICATION_STATUS = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  FAILED: 'FAILED',
  DELIVERED: 'DELIVERED',
};

export default notificationAPI;
