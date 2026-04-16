import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { USER_ROLES } from '../constants/appConstants';
import authAPI from '../services/authAPI';
import { validateStoredTokens } from '../utils/tokenUtils';

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

  // Load user from localStorage and verify token on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Validate stored tokens first
        const tokensValid = validateStoredTokens();
        
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('access_token');
        
        if (storedUser && token && tokensValid) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Verify token by fetching profile
          try {
            const profile = await authAPI.getProfile();
            // Update user data from backend
            const updatedUser = {
              ...parsedUser,
              ...profile,
            };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          } catch (error) {
            // Token invalid or profile fetch failed, clear everything
            console.error('Token verification failed:', error);
            authAPI.logout();
            setUser(null);
          }
        } else if (!tokensValid) {
          // Tokens were invalid, clear user
          authAPI.logout();
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /**
   * Login function
   * @param {Object} userData - User data from API
   */
  const login = useCallback((userData) => {
    try {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
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
    authAPI.logout();
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
