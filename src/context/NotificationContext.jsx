import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import notificationAPI from '../services/notificationAPI';

const NotificationContext = createContext();

/**
 * Custom hook to access notification context
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

/**
 * NotificationProvider Component
 * Manages notification state and provides notification functions
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);

  /**
   * Load notifications
   */
  const loadNotifications = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await notificationAPI.getNotifications(filters);
      const notificationsList = response.results || response;
      setNotifications(notificationsList);
      
      // Count unread (assuming notifications without is_read are unread)
      const unread = notificationsList.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load statistics
   */
  const loadStatistics = useCallback(async () => {
    try {
      const stats = await notificationAPI.getStatistics();
      setStatistics(stats);
      return stats;
    } catch (error) {
      console.error('Failed to load notification statistics:', error);
      return null;
    }
  }, []);

  /**
   * Send a notification
   * notificationData may include:
   *   - notification_type
   *   - phone_number
   *   - message
   *   - channel ("SMS" or "WHATSAPP", defaults to SMS)
   */
  const sendNotification = useCallback(async (notificationData) => {
    try {
      const notification = await notificationAPI.sendNotification(notificationData);
      // Reload notifications to show the new one
      await loadNotifications();
      return notification;
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }, [loadNotifications]);

  /**
   * Send verification code to a phone number
   */
  const sendVerificationCode = useCallback(async (phone_number) => {
    try {
      const res = await notificationAPI.sendVerificationCode(phone_number);
      return res;
    } catch (error) {
      console.error('Failed to send verification code:', error);
      throw error;
    }
  }, []);

  /**
   * Verify phone with code
   */
  const verifyPhone = useCallback(async (code) => {
    try {
      const res = await notificationAPI.verifyPhone(code);
      return res;
    } catch (error) {
      console.error('Failed to verify phone:', error);
      throw error;
    }
  }, []);

  /**
   * Retry a failed notification
   */
  const retryNotification = useCallback(async (id) => {
    try {
      const notification = await notificationAPI.retryNotification(id);
      // Reload notifications to update status
      await loadNotifications();
      return notification;
    } catch (error) {
      console.error('Failed to retry notification:', error);
      throw error;
    }
  }, [loadNotifications]);

  /**
   * Mark notification as read
   */
  const markAsRead = useCallback(async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  /**
   * Clear old notifications
   */
  const clearOldNotifications = useCallback(async () => {
    try {
      const result = await notificationAPI.clearOldNotifications();
      await loadNotifications();
      return result;
    } catch (error) {
      console.error('Failed to clear old notifications:', error);
      throw error;
    }
  }, [loadNotifications]);

  /**
   * Refresh notifications
   */
  const refreshNotifications = useCallback(() => {
    loadNotifications();
    loadStatistics();
  }, [loadNotifications, loadStatistics]);

  // Load notifications on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      loadNotifications();
      loadStatistics();
    }
  }, [loadNotifications, loadStatistics]);

  const value = {
    notifications,
    unreadCount,
    loading,
    statistics,
    loadNotifications,
    loadStatistics,
    sendNotification,
    sendVerificationCode,
    verifyPhone,
    retryNotification,
    markAsRead,
    clearOldNotifications,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
