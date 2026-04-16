/**
 * Payment API Service
 * Handles all payment-related API calls
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const PAYMENTS_ENDPOINT = `${API_BASE_URL}/payments`;

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
  
  if (errorData) {
    return errorData;
  }
  
  if (status === 401) {
    return { detail: 'Unauthorized - Please login again' };
  }
  
  if (status === 403) {
    return { detail: 'Forbidden - Admin access required' };
  }
  
  return { detail: error.message || 'An error occurred' };
};

export const paymentAPI = {
  /**
   * Create a payment
   * @param {Object} paymentData - Payment data (booking, payment_method, amount, etc.)
   */
  createPayment: async (paymentData) => {
    try {
      const response = await axios.post(
        `${PAYMENTS_ENDPOINT}/create/`,
        paymentData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw handleError(error, 'createPayment');
    }
  },

  /**
   * ADMIN: Get all payments
   * @param {Object} filters - Filter options (booking, status, page)
   */
  getPayments: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.booking) params.append('booking', filters.booking);
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page);

      const response = await axios.get(`${PAYMENTS_ENDPOINT}/`, {
        params,
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw handleError(error, 'getPayments');
    }
  },
};

export default paymentAPI;
