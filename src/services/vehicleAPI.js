/**
 * Vehicle API Service
 * Handles all vehicle-related API calls
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const VEHICLES_ENDPOINT = `${API_BASE_URL}/vehicles`;

// Create axios instance with auth
const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  console.log('Auth Check:', { hasToken: !!token, tokenLength: token?.length });
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
  
  // Return detailed error info
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

export const vehicleAPI = {
  /**
   * Get all vehicles (public - shows active only)
   */
  getAllVehicles: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.vehicle_type) params.append('vehicle_type', filters.vehicle_type);
      if (filters.search) params.append('search', filters.search);
      if (filters.ordering) params.append('ordering', filters.ordering);

      const response = await axios.get(`${VEHICLES_ENDPOINT}/`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get vehicle details (public)
   */
  getVehicleById: async (id) => {
    try {
      const response = await axios.get(`${VEHICLES_ENDPOINT}/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * ADMIN: Get all vehicles including inactive
   */
  getAdminVehicles: async (filters = {}) => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('Loading admin vehicles. Token exists:', !!token);
      
      const params = new URLSearchParams();
      if (filters.vehicle_type) params.append('vehicle_type', filters.vehicle_type);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.ordering) params.append('ordering', filters.ordering);
      if (filters.page) params.append('page', filters.page);

      const response = await axios.get(`${VEHICLES_ENDPOINT}/admin/`, {
        params,
        headers: getAuthHeader(),
      });
      console.log('Admin vehicles loaded successfully');
      return response.data;
    } catch (error) {
      throw handleError(error, 'getAdminVehicles');
    }
  },

  /**
   * ADMIN: Create new vehicle
   */
  createVehicle: async (vehicleData) => {
    try {
      const response = await axios.post(
        `${VEHICLES_ENDPOINT}/admin/`,
        vehicleData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * ADMIN: Update vehicle
   */
  updateVehicle: async (id, vehicleData) => {
    try {
      const response = await axios.patch(
        `${VEHICLES_ENDPOINT}/admin/${id}/`,
        vehicleData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * ADMIN: Delete vehicle
   */
  deleteVehicle: async (id) => {
    try {
      await axios.delete(`${VEHICLES_ENDPOINT}/admin/${id}/`, {
        headers: getAuthHeader(),
      });
      return { success: true };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * ADMIN: Bulk update vehicle status
   */
  bulkUpdateStatus: async (ids, isActive) => {
    try {
      const payload = {
        ids,
        is_active: isActive,
      };
      const response = await axios.post(
        `${VEHICLES_ENDPOINT}/admin/bulk_update_status/`,
        payload,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * ADMIN: Bulk delete vehicles
   */
  bulkDelete: async (ids) => {
    try {
      const response = await axios.post(
        `${VEHICLES_ENDPOINT}/admin/bulk_delete/`,
        { ids },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get vehicle statistics (admin only)
   */
  getVehicleStats: async () => {
    try {
      const response = await axios.get(`${VEHICLES_ENDPOINT}/admin/statistics/`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default vehicleAPI;
