import { useState, useEffect } from 'react';
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
  Trash2,
  Inbox,
  Filter,
  Check,
  ArrowRight,
  RefreshCw,
  Home,
} from 'lucide-react';

export default function Notifications() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
    loading,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'bookings')
      return (
        n.type?.includes('booking') ||
        n.relatedEntityType === 'Booking'
      );
    if (activeFilter === 'reviews')
      return (
        n.type?.includes('review') ||
        n.relatedEntityType === 'Review'
      );
    if (activeFilter === 'properties')
      return (
        n.type?.includes('property') ||
        n.relatedEntityType === 'Property'
      );
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_confirmed':
        return (
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
      case 'booking_rejected':
      case 'booking_cancelled':
        return (
          <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-900/50 shadow-sm">
            <XCircle className="w-5 h-5" />
          </div>
        );
      case 'new_review':
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#b58d59] dark:text-[#d4b996] flex items-center justify-center shrink-0 border border-[#e5e0d8] dark:border-[#3f3f46] shadow-sm">
            <Star className="w-5 h-5 fill-current" />
          </div>
        );
      case 'property_submitted':
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center shrink-0 border border-[#e5e0d8] dark:border-[#3f3f46] shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
        );
      case 'booking_request':
      case 'booking_submitted':
      default:
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center shrink-0 border border-[#e5e0d8] dark:border-[#3f3f46] shadow-sm">
            <Calendar className="w-5 h-5" />
          </div>
        );
    }
  };

  const formatTimestamp = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleItemClick = async (n) => {
    if (!n.isRead) {
      await markAsRead(n._id);
    }
    if (n.link) {
      navigate(n.link);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] dark:bg-[#121214] py-10 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 bg-white dark:bg-[#1c1c20] p-7 sm:p-9 rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] text-[10px] font-bold border border-[#e5e0d8] dark:border-[#3f3f46] uppercase tracking-wider">
                Activity Feed
              </span>
              {unreadCount > 0 && (
                <span className="px-3 py-0.5 rounded-full bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <h1 className="font-editorial text-2xl sm:text-4xl font-light text-[#18181b] dark:text-[#f4f0e8] tracking-tight mt-2">
              Notifications & Alerts
            </h1>
            <p className="text-[#71717a] dark:text-[#a1a1aa] text-xs sm:text-sm mt-1">
              Stay updated on incoming reservations, listing audits, guest inquiries, and reviews.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchNotifications()}
              disabled={loading}
              className="p-3 bg-[#f4f0e8] hover:bg-[#ede7dc] dark:bg-[#27272a] dark:hover:bg-[#323236] text-[#18181b] dark:text-[#f4f0e8] rounded-full transition-colors cursor-pointer border border-[#e5e0d8] dark:border-[#3f3f46]"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] text-xs font-semibold uppercase tracking-wider rounded-full shadow-editorial transition-all cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            {
              id: 'bookings',
              label: 'Bookings',
              count: notifications.filter(
                (n) =>
                  n.type?.includes('booking') ||
                  n.relatedEntityType === 'Booking'
              ).length,
            },
            {
              id: 'reviews',
              label: 'Reviews',
              count: notifications.filter(
                (n) =>
                  n.type?.includes('review') ||
                  n.relatedEntityType === 'Review'
              ).length,
            },
            {
              id: 'properties',
              label: 'Properties',
              count: notifications.filter(
                (n) =>
                  n.type?.includes('property') ||
                  n.relatedEntityType === 'Property'
              ).length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                activeFilter === tab.id
                  ? 'bg-[#18181b] text-white dark:bg-[#d4b996] dark:text-[#18181b] shadow-sm'
                  : 'bg-white dark:bg-[#1c1c20] text-[#71717a] dark:text-[#a1a1aa] hover:bg-[#f4f0e8] dark:hover:bg-[#27272a] border border-[#e5e0d8] dark:border-[#2e2e34]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                  activeFilter === tab.id
                    ? 'bg-white/20 dark:bg-black/20 text-white dark:text-[#18181b]'
                    : 'bg-[#f4f0e8] dark:bg-[#27272a] text-[#71717a] dark:text-[#a1a1aa]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-[#1c1c20] rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial overflow-hidden divide-y divide-[#f4f0e8] dark:divide-[#2e2e34]">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center mx-auto shadow-inner">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="font-editorial text-2xl font-light text-[#18181b] dark:text-[#f4f0e8]">
                No notifications to display
              </h3>
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] max-w-sm mx-auto">
                {activeFilter === 'unread'
                  ? 'You are completely caught up with all updates.'
                  : 'When activity occurs on your account, real-time notifications will arrive here.'}
              </p>
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm transition-all"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Explore Stays</span>
              </Link>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n._id}
                className={`p-5 sm:p-6 flex items-start justify-between gap-4 hover:bg-[#fbfbf9] dark:hover:bg-[#161618] transition-colors group ${
                  !n.isRead ? 'bg-[#f4f0e8]/40 dark:bg-[#27272a]/30' : ''
                }`}
              >
                <div
                  onClick={() => handleItemClick(n)}
                  className="flex items-start gap-4 flex-1 cursor-pointer"
                >
                  {getNotificationIcon(n.type)}

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2
                        className={`text-sm ${
                          !n.isRead
                            ? 'font-bold text-[#18181b] dark:text-[#f4f0e8]'
                            : 'font-semibold text-[#52525b] dark:text-[#d4d4d8]'
                        }`}
                      >
                        {n.title}
                      </h2>
                      {!n.isRead && (
                        <span className="px-2 py-0.5 rounded-full bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b] text-[9px] font-bold uppercase tracking-wider">
                          New
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
                      {n.message}
                    </p>

                    <div className="pt-1 flex items-center gap-3 text-[11px] text-[#a1a1aa] dark:text-[#71717a] font-medium">
                      <span>{formatTimestamp(n.createdAt)}</span>
                      {n.link && (
                        <>
                          <span>•</span>
                          <span className="text-[#b58d59] dark:text-[#d4b996] font-semibold group-hover:underline flex items-center gap-1">
                            <span>Open Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 pt-1">
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n._id)}
                      className="p-2 text-[#71717a] hover:text-[#18181b] dark:text-[#a1a1aa] dark:hover:text-[#f4f0e8] hover:bg-[#f4f0e8] dark:hover:bg-[#27272a] rounded-full transition-colors cursor-pointer"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n._id)}
                    className="p-2 text-[#71717a] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-full transition-colors cursor-pointer"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
