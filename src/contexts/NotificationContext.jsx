import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification) => {
    const newNotif = {
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      is_read: false,
      ...notification,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setUnreadCount((prev) => prev + 1);

    /* Show toast */
    const toastStyle = {
      background: '#111827',
      color: '#F9FAFB',
      border: '1px solid rgba(124, 58, 237, 0.3)',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 0 20px rgba(124, 58, 237, 0.2)',
    };

    switch (notification.type) {
      case 'success':
        toast.success(notification.message, { style: toastStyle, duration: 4000 });
        break;
      case 'error':
        toast.error(notification.message, { style: toastStyle, duration: 5000 });
        break;
      default:
        toast(notification.message, { style: toastStyle, duration: 4000 });
    }
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  /* Toast shortcuts */
  const showSuccess = useCallback((message) => {
    addNotification({ type: 'success', title: 'Success', message });
  }, [addNotification]);

  const showError = useCallback((message) => {
    addNotification({ type: 'error', title: 'Error', message });
  }, [addNotification]);

  const showInfo = useCallback((message) => {
    addNotification({ type: 'info', title: 'Info', message });
  }, [addNotification]);

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    showSuccess,
    showError,
    showInfo,
  }), [notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearNotifications, showSuccess, showError, showInfo]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export default NotificationContext;
