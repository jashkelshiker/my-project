/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import axios from 'axios';
import { clearAuthTokens, validateStoredTokens } from '../utils/tokenUtils';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      // Basic check: token exists and looks like a JWT (has at least 2 dots)
      const dotCount = (token.match(/\./g) || []).length;
      if (dotCount < 2) {
        console.warn('Token does not appear to be a valid JWT format');
        clearAuthTokens();
        return Promise.reject(new Error('Invalid token format'));
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401 and invalid token errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorData = error.response?.data;
    const status = error.response?.status;
    
    // Check for specific invalid token errors (these are terminal - user must re-login)
    if (
      (typeof errorData?.detail === 'string' && errorData.detail.includes('Given token not valid')) ||
      (typeof errorData?.detail === 'string' && errorData.detail.includes('Token is invalid'))
    ) {
      console.warn('Invalid token detected:', errorData.detail);
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        clearAuthTokens();
        window.location.href = '/auth';
      }
      return Promise.reject(error);
    }
    
    // Handle 401 Unauthorized - attempt token refresh
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        console.log('Attempting token refresh...');
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        if (!access) {
          throw new Error('No access token in refresh response');
        }
        
        console.log('Token refreshed successfully');
        localStorage.setItem('access_token', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError.message);
        clearAuthTokens();
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  /**
   * Login user
   * @param {string} username - Username or email
   * @param {string} password - Password
   */
  login: async (username, password) => {
    try {
      // Clear any invalid tokens first
      validateStoredTokens();
      
      const response = await axios.post(`${API_BASE_URL}/token/`, {
        username,
        password,
      });
      
      const { access, refresh } = response.data;
      
      // Trust the server's tokens - it knows what it's sending
      // Basic structure validation only
      if (!access || !refresh || typeof access !== 'string' || typeof refresh !== 'string') {
        console.error('Server response missing or invalid token fields', { access: !!access, refresh: !!refresh });
        throw new Error('Server did not return valid tokens');
      }
      
      console.log('Login successful, storing tokens');
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Get user profile
      const profileResponse = await api.get('/accounts/profile/');
      const userData = {
        ...profileResponse.data,
        access_token: access,
      };
      
      return userData;
    } catch (error) {
      // Log detailed error info to help debug network/CORS issues in browser
      try {
        // Browser-friendly logging
        // eslint-disable-next-line no-console
        console.error('authAPI.login error', {
          message: error.message,
          response: error.response && {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers,
          },
          request: error.request || null,
        });
      } catch (logErr) {
        // ignore logging errors
      }

      throw error.response?.data || { detail: error.message };
    }
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   */
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/accounts/register/`, userData);
      
      // Auto-login after registration
      if (response.data.username && userData.password) {
        return await authAPI.login(response.data.username, userData.password);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: error.message };
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    try {
      const response = await api.get('/accounts/profile/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: error.message };
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/accounts/profile/', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: error.message };
    }
  },

  /**
   * Logout user (clears tokens)
   */
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  /**
   * Refresh access token
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
        refresh: refreshToken,
      });
      
      const { access } = response.data;
      localStorage.setItem('access_token', access);
      return access;
    } catch (error) {
      authAPI.logout();
      throw error.response?.data || { detail: error.message };
    }
  },
};

export default authAPI;
