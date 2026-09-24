import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch unread count lightweight polling / check
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await api.get('/api/notifications/unread-count');
      if (res.data && res.data.success) {
        setUnreadCount(res.data.count || 0);
      }
    } catch (err) {
      // Graceful error silence for polling
    }
  }, [isAuthenticated]);

  // Fetch full notification list
  const fetchNotifications = useCallback(
    async (unreadOnly = false) => {
      if (!isAuthenticated) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      setLoading(true);
      try {
        const res = await api.get('/api/notifications', {
          params: { unreadOnly, limit: 50 },
        });
        if (res.data && res.data.success) {
          setNotifications(res.data.notifications || []);
          setUnreadCount(res.data.unreadCount || 0);
        }
      } catch (err) {
        console.warn('Could not load notifications:', err.message);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Mark single notification as read
  const markAsRead = async (id) => {
    if (!id || !isAuthenticated) return;
    try {
      const res = await api.patch(`/api/notifications/${id}/read`);
      if (res.data && res.data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        if (res.data.unreadCount !== undefined) {
          setUnreadCount(res.data.unreadCount);
        } else {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (err) {
      console.warn('Could not mark notification as read:', err.message);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.patch('/api/notifications/read-all');
      if (res.data && res.data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.warn('Could not mark all notifications as read:', err.message);
    }
  };

  // Delete a notification
  const deleteNotification = async (id) => {
    if (!id || !isAuthenticated) return;
    try {
      const res = await api.delete(`/api/notifications/${id}`);
      if (res.data && res.data.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        if (res.data.unreadCount !== undefined) {
          setUnreadCount(res.data.unreadCount);
        }
      }
    } catch (err) {
      console.warn('Could not delete notification:', err.message);
    }
  };

  // Initial fetch and periodic polling (every 30 seconds)
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications, fetchUnreadCount]);

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export default NotificationContext;
