/**
 * User API Service (Admin)
 * Handles admin-only user management endpoints
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const USERS_ENDPOINT = `${API_BASE_URL}/accounts/users`;

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleError = (error, endpoint) => {
  const errorData = error.response?.data;
  const status = error.response?.status;

  // eslint-disable-next-line no-console
  console.error(`API Error [${endpoint}]:`, {
    status,
    data: errorData,
    message: error.message,
  });

  if (errorData) return errorData;
  if (status === 401) return { detail: 'Unauthorized - Please login again' };
  if (status === 403) return { detail: 'Forbidden - Admin access required' };
  return { detail: error.message || 'An error occurred' };
};

export const userAPI = {
  /**
   * ADMIN: List users
   * @param {Object} filters
   * @param {string} [filters.search]
   * @param {string} [filters.role] - ADMIN or USER
   * @param {string} [filters.ordering]
   * @param {number} [filters.page]
   */
  getUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);
      if (filters.ordering) params.append('ordering', filters.ordering);
      if (filters.page) params.append('page', filters.page);

      const response = await axios.get(`${USERS_ENDPOINT}/`, {
        params,
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw handleError(error, 'getUsers');
    }
  },
};

export default userAPI;

