/**
 * Vehicle API Service
 * Handles all vehicle-related API calls with proper authentication
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const VEHICLES_ENDPOINT = `${API_BASE_URL}/vehicles`;

// Create authenticated axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`📤 [${config.method?.toUpperCase()}] ${config.url}`);
    } else {
      console.warn('⚠️ No access token found in localStorage for API request');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle 401 responses - refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Enhanced error handler with console logging
const handleError = (error, endpoint) => {
  const errorData = error.response?.data;
  const status = error.response?.status;
  const message = error.message;
  
  const errorInfo = {
    endpoint,
    status,
    data: errorData,
    message,
    url: error.config?.url,
    headers: {
      hasAuth: !!error.config?.headers?.Authorization,
    },
  };
  
  console.error(`❌ API Error [${endpoint}]:`, errorInfo);
  
  // Return detailed error info
  if (errorData) {
    return errorData;
  }
  
  if (status === 401) {
    return { detail: 'Unauthorized - Please login again' };
  }
  
  if (status === 403) {
    return { detail: 'Forbidden - Admin access required. Make sure you are logged in as an admin user.' };
  }

  if (status === 404) {
    return { detail: `Endpoint not found: ${error.config?.url}` };
  }
  
  if (!error.response) {
    return { detail: `Network error: ${message}. Is the backend running at ${API_BASE_URL}?` };
  }
  
  return { detail: message || 'An error occurred' };
};

export const vehicleAPI = {
  /**
   * Get all vehicles (admin-only now, permission reduced on backend).
   * Regular users will receive 403 if they try to call this.
   */
  getAllVehicles: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.vehicle_type) params.append('vehicle_type', filters.vehicle_type);
      if (filters.search) params.append('search', filters.search);
      if (filters.ordering) params.append('ordering', filters.ordering);

      const response = await api.get(`${VEHICLES_ENDPOINT}/`, { params });
      return response.data;
    } catch (error) {
      throw handleError(error, 'getAllVehicles');
    }
  },

  /**
   * Get vehicle details (public)
   */
  getVehicleById: async (id) => {
    try {
      const response = await api.get(`${VEHICLES_ENDPOINT}/${id}/`);
      return response.data;
    } catch (error) {
      throw handleError(error, 'getVehicleById');
    }
  },

  /**
   * ADMIN: Get all vehicles including inactive
   */
  getAdminVehicles: async (filters = {}) => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('🔐 Token check:', { hasToken: !!token, tokenLength: token?.length });
      
      if (!token) {
        throw new Error('No authentication token found. Please log in first.');
      }
      
      const params = new URLSearchParams();
      if (filters.vehicle_type) params.append('vehicle_type', filters.vehicle_type);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.ordering) params.append('ordering', filters.ordering);
      if (filters.page) params.append('page', filters.page);

      console.log('📥 Fetching admin vehicles from:', `${VEHICLES_ENDPOINT}/admin/`);
      const response = await api.get(`${VEHICLES_ENDPOINT}/admin/`, { params });
      console.log('✅ Admin vehicles loaded successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('🚨 getAdminVehicles error:', error);
      throw handleError(error, 'getAdminVehicles');
    }
  },

  /**
   * ADMIN: Create new vehicle
   */
  createVehicle: async (vehicleData, headers = {}) => {
    try {
      // if FormData is provided, ensure the content-type is set properly
      if (vehicleData instanceof FormData) {
        headers['Content-Type'] = 'multipart/form-data';
      }
      const response = await api.post(`${VEHICLES_ENDPOINT}/admin/`, vehicleData, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw handleError(error, 'createVehicle');
    }
  },

  /**
   * ADMIN: Update vehicle
   */
  updateVehicle: async (id, vehicleData, headers = {}) => {
    try {
      if (vehicleData instanceof FormData) {
        headers['Content-Type'] = 'multipart/form-data';
      }
      const response = await api.patch(`${VEHICLES_ENDPOINT}/admin/${id}/`, vehicleData, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw handleError(error, 'updateVehicle');
    }
  },

  /**
   * ADMIN: Delete vehicle
   */
  deleteVehicle: async (id) => {
    try {
      await api.delete(`${VEHICLES_ENDPOINT}/admin/${id}/`);
      return { success: true };
    } catch (error) {
      throw handleError(error, 'deleteVehicle');
    }
  },

  /**
   * ADMIN: Bulk update vehicle status
   */
  bulkUpdateStatus: async (ids, isActive) => {
    try {
      const response = await api.post(`${VEHICLES_ENDPOINT}/admin/bulk_update_status/`, {
        ids,
        is_active: isActive,
      });
      return response.data;
    } catch (error) {
      throw handleError(error, 'bulkUpdateStatus');
    }
  },

  /**
   * ADMIN: Bulk delete vehicles
   */
  bulkDelete: async (ids) => {
    try {
      const response = await api.post(`${VEHICLES_ENDPOINT}/admin/bulk_delete/`, {
        ids,
      });
      return response.data;
    } catch (error) {
      throw handleError(error, 'bulkDelete');
    }
  },

  /**
   * Get vehicle statistics (admin only)
   */
  getVehicleStats: async () => {
    try {
      const response = await api.get(`${VEHICLES_ENDPOINT}/admin/statistics/`);
      return response.data;
    } catch (error) {
      throw handleError(error, 'getVehicleStats');
    }
  },
};

export default vehicleAPI;
