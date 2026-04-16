/**
 * Booking API Service
 * Handles all booking-related API calls
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const BOOKINGS_ENDPOINT = `${API_BASE_URL}/bookings`;

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
    // prefer non_field_errors or any list of messages
    if (Array.isArray(errorData.non_field_errors)) {
      return { detail: errorData.non_field_errors.join(' ') };
    }
    // if errorData itself is object, return its first message
    if (typeof errorData === 'object') {
      const firstKey = Object.keys(errorData)[0];
      const val = errorData[firstKey];
      if (Array.isArray(val)) {
        return { detail: val.join(' ') };
      }
    }
    return { detail: error.message || 'An error occurred' };
  }
};

export const bookingAPI = {
  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   */
  createBooking: async (bookingData) => {
    try {
      const response = await axios.post(
        `${BOOKINGS_ENDPOINT}/create/`,
        bookingData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw handleError(error, 'createBooking');
    }
  },

  /**
   * Get user's bookings
   * @param {Object} filters - Filter options (status, vehicle, ordering, page)
   */
  getMyBookings: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.vehicle) params.append('vehicle', filters.vehicle);
      if (filters.ordering) params.append('ordering', filters.ordering);
      if (filters.page) params.append('page', filters.page);

      const response = await axios.get(`${BOOKINGS_ENDPOINT}/my/`, {
        params,
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw handleError(error, 'getMyBookings');
    }
  },

  /**
   * Get booking by ID
   * @param {number} id - Booking ID
   */
  getBookingById: async (id) => {
    try {
      const response = await axios.get(`${BOOKINGS_ENDPOINT}/${id}/`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw handleError(error, 'getBookingById');
    }
  },

  /**
   * ADMIN: Get all bookings
   * @param {Object} filters - Filter options
   */
  getAdminBookings: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.user) params.append('user', filters.user);
      if (filters.status) params.append('status', filters.status);
      if (filters.vehicle) params.append('vehicle', filters.vehicle);
      if (filters.search) params.append('search', filters.search);
      if (filters.ordering) params.append('ordering', filters.ordering);
      if (filters.page) params.append('page', filters.page);

      const response = await axios.get(`${BOOKINGS_ENDPOINT}/admin-list/`, {
        params,
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw handleError(error, 'getAdminBookings');
    }
  },

  /**
   * ADMIN: Update booking status
   * @param {number} id - Booking ID
   * @param {Object} updates - Update data (status, etc.)
   */
  updateBooking: async (id, updates) => {
    try {
      const response = await axios.patch(
        `${BOOKINGS_ENDPOINT}/${id}/`,
        updates,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw handleError(error, 'updateBooking');
    }
  },

  /**
   * ADMIN: Delete booking
   * @param {number} id - Booking ID
   */
  deleteBooking: async (id) => {
    try {
      await axios.delete(`${BOOKINGS_ENDPOINT}/${id}/`, {
        headers: getAuthHeader(),
      });
      return { success: true };
    } catch (error) {
      throw handleError(error, 'deleteBooking');
    }
  },

  /**
   * Cancel booking (user)
   * @param {number} id - Booking ID
   */
  cancelBooking: async (id) => {
    try {
      const response = await axios.patch(
        `${BOOKINGS_ENDPOINT}/${id}/`,
        { status: 'CANCELLED' },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw handleError(error, 'cancelBooking');
    }
  },

  /**
   * Availability check for a vehicle
   * @param {number} vehicleId
   * @param {string} start_date
   * @param {string} end_date
   */
  checkAvailability: async (vehicleId, start_date, end_date) => {
    try {
      const response = await axios.get(
        `${BOOKINGS_ENDPOINT}/availability/`,
        {
          params: { vehicle: vehicleId, start_date, end_date },
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw handleError(error, 'checkAvailability');
    }
  },
};

export default bookingAPI;
