import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { USER_ROLES, DEMO_CREDENTIALS } from '../constants/appConstants';

const AuthContext = createContext();

/**
 * Custom hook to access auth context
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * AuthProvider Component
 * Manages authentication state and user session
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /**
   * Login function
   * @param {Object} userData - User data to store
   */
  const login = useCallback((userData) => {
    try {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      // For admin demo: try to obtain a real JWT from backend token endpoint
      (async () => {
        try {
          if (userData?.role === USER_ROLES.ADMIN) {
            const API = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
            const tokenUrl = `${API.replace(/\/$/, '')}/token/`;
            const resp = await fetch(tokenUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: DEMO_CREDENTIALS.ADMIN.USERNAME, password: DEMO_CREDENTIALS.ADMIN.PASSWORD }),
            });
            const data = await resp.json();
            if (resp.ok && data.access) {
              localStorage.setItem('access_token', data.access);
              // If backend returned user payload, merge it
              if (data.user) {
                const merged = { ...userData, ...data.user };
                setUser(merged);
                localStorage.setItem('user', JSON.stringify(merged));
              }
            } else {
              console.warn('Failed to obtain JWT for demo admin:', data);
            }
          } else {
            localStorage.removeItem('access_token');
          }
        } catch (e) {
          console.error('Error fetching demo JWT:', e);
        }
      })();
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
      throw new Error('Failed to save user session');
    }
  }, []);

  /**
   * Logout function
   */
  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
    } catch (error) {
      console.error('Error removing user from localStorage:', error);
    }
  }, []);

  /**
   * Check if user is admin
   */
  const isAdmin = useCallback(() => {
    return user?.role === USER_ROLES.ADMIN;
  }, [user]);

  /**
   * Check if user is regular user
   */
  const isUser = useCallback(() => {
    return user?.role === USER_ROLES.USER;
  }, [user]);

  const value = {
    user,
    login,
    logout,
    isAdmin,
    isUser,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
