import React from 'react';
import { useNotifications } from '../../context/NotificationContext';

// Simple date formatter (no external dependency)
const formatDistanceToNow = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

/**
 * Notifications List Component
 * Displays list of notifications
 */
export default function NotificationsList({ onClose }) {
  const {
    notifications,
    loading,
    markAsRead,
    retryNotification,
  } = useNotifications();

  const getNotificationIcon = (type) => {
    const icons = {
      BOOKING_CONFIRMATION: '📋',
      BOOKING_APPROVED: '✅',
      BOOKING_REJECTED: '❌',
      PAYMENT_REMINDER: '💳',
      VEHICLE_RETURNED: '🚗',
      VERIFICATION_CODE: '🔐',
      GENERAL_ALERT: '🔔',
    };
    return icons[type] || '📢';
  };

  const getStatusColor = (status) => {
    const colors = {
      SENT: 'text-emerald-600 bg-emerald-50',
      DELIVERED: 'text-blue-600 bg-blue-50',
      FAILED: 'text-red-600 bg-red-50',
      PENDING: 'text-yellow-600 bg-yellow-50',
    };
    return colors[status] || 'text-slate-600 bg-slate-50';
  };

  const formatNotificationType = (type) => {
    return type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        <p className="mt-4 text-sm text-slate-600">Loading notifications...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-4">🔔</div>
        <p className="text-slate-600">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
            !notification.is_read ? 'bg-blue-50/50' : ''
          }`}
          onClick={() => {
            if (!notification.is_read) {
              markAsRead(notification.id);
            }
          }}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl flex-shrink-0">
              {getNotificationIcon(notification.notification_type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {formatNotificationType(notification.notification_type)}
                  </p>
                  {notification.message && (
                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                      {notification.message}
                    </p>
                  )}
                </div>
                {!notification.is_read && (
                  <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1"></span>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    notification.status
                  )}`}
                >
                  {notification.status}
                </span>
                {notification.created_at && (
                  <span className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                )}
              </div>
              {notification.status === 'FAILED' && (
                <div className="mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      retryNotification(notification.id);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Retry sending
                  </button>
                  {notification.error_message && (
                    <p className="text-xs text-red-600 mt-1">
                      {notification.error_message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
