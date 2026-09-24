import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import {
  Bell,
  CheckCircle2,
  Calendar,
  XCircle,
  Star,
  Building2,
  CheckCheck,
  ExternalLink,
  ShieldAlert,
  Inbox,
  Clock,
  Trash2,
} from 'lucide-react';

export default function NotificationDropdown() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loading,
    deleteNotification,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    setIsOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);

    if (diffSeconds < 60) return 'Just now';
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_confirmed':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'booking_rejected':
      case 'booking_cancelled':
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <XCircle className="w-4 h-4" />
          </div>
        );
      case 'new_review':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <Star className="w-4 h-4 fill-current" />
          </div>
        );
      case 'property_submitted':
        return (
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
            <Building2 className="w-4 h-4" />
          </div>
        );
      case 'booking_request':
      case 'booking_submitted':
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
            <Calendar className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white animate-pulse shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="p-4 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Inbox className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-700">No notifications yet</p>
                <p className="text-xs text-slate-400">
                  Updates on your bookings, stays, and reviews will appear here.
                </p>
              </div>
            ) : (
              notifications.slice(0, 8).map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 flex items-start gap-3 hover:bg-slate-50/80 transition-colors cursor-pointer group ${
                    !notification.isRead ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  {getNotificationIcon(notification.type)}

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs truncate ${
                          !notification.isRead
                            ? 'font-bold text-slate-900'
                            : 'font-semibold text-slate-700'
                        }`}
                      >
                        {notification.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors w-full text-center py-1 flex items-center justify-center gap-1"
            >
              <span>View All Notifications</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
