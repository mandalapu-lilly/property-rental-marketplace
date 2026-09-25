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
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/40">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'booking_rejected':
      case 'booking_cancelled':
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-800/40">
            <XCircle className="w-4 h-4" />
          </div>
        );
      case 'new_review':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-800/40">
            <Star className="w-4 h-4 fill-current" />
          </div>
        );
      case 'property_submitted':
        return (
          <div className="w-8 h-8 rounded-xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#b58d59] dark:text-[#d4b996] flex items-center justify-center shrink-0 border border-[#ded7cb] dark:border-[#3f3f46]">
            <Building2 className="w-4 h-4" />
          </div>
        );
      case 'booking_request':
      case 'booking_submitted':
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center shrink-0 border border-[#e5e0d8] dark:border-[#3f3f46]">
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
        className="relative p-2 rounded-xl text-[#52525b] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-[#fbfbf9] hover:bg-[#f4f0e8] dark:hover:bg-[#1c1c20] transition-colors cursor-pointer"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white dark:border-[#121214] animate-pulse shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#1c1c20] rounded-3xl shadow-editorial-lg border border-[#e5e0d8] dark:border-[#27272a] z-50 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="p-4 bg-[#fbfbf9] dark:bg-[#18181b] border-b border-[#e8e3da] dark:border-[#27272a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-[#18181b] dark:text-[#fbfbf9] text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-[#f4f0e8] dark:bg-[#27272a] text-[#b58d59] dark:text-[#d4b996] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#ded7cb] dark:border-[#3f3f46]">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-[#b58d59] dark:text-[#d4b996] hover:text-[#8c6b3e] dark:hover:text-[#f4f0e8] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-[#f4f0e8] dark:divide-[#27272a]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#8c827a] flex items-center justify-center mx-auto">
                  <Inbox className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-[#18181b] dark:text-[#fbfbf9]">No notifications yet</p>
                <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
                  Updates on your bookings, stays, and reviews will appear here.
                </p>
              </div>
            ) : (
              notifications.slice(0, 8).map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 flex items-start gap-3 hover:bg-[#fbfbf9] dark:hover:bg-[#27272a]/50 transition-colors cursor-pointer group ${
                    !notification.isRead ? 'bg-[#f8f6f0] dark:bg-[#242429]' : ''
                  }`}
                >
                  {getNotificationIcon(notification.type)}

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs truncate ${
                          !notification.isRead
                            ? 'font-bold text-[#18181b] dark:text-[#fbfbf9]'
                            : 'font-semibold text-[#52525b] dark:text-[#d4d4d8]'
                        }`}
                      >
                        {notification.title}
                      </h4>
                      <span className="text-[10px] text-[#8c827a] dark:text-[#a1a1aa] shrink-0 font-medium">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-[#b58d59] dark:bg-[#d4b996] shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-[#fbfbf9] dark:bg-[#18181b] border-t border-[#e8e3da] dark:border-[#27272a] flex items-center justify-between text-xs">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-[#b58d59] dark:text-[#d4b996] hover:text-[#8c6b3e] dark:hover:text-[#f4f0e8] font-bold transition-colors w-full text-center py-1 flex items-center justify-center gap-1"
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
