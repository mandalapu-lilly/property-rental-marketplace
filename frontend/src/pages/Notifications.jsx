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
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
      case 'booking_rejected':
      case 'booking_cancelled':
        return (
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100 shadow-sm">
            <XCircle className="w-5 h-5" />
          </div>
        );
      case 'new_review':
        return (
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 shadow-sm">
            <Star className="w-5 h-5 fill-current" />
          </div>
        );
      case 'property_submitted':
        return (
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100 shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
        );
      case 'booking_request':
      case 'booking_submitted':
      default:
        return (
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 shadow-sm">
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
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 uppercase tracking-wider">
                Activity Center
              </span>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold shadow-sm">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              Notifications & Updates
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Stay informed on booking requests, reservation status changes, reviews, and verified listings.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchNotifications()}
              disabled={loading}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  activeFilter === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No notifications found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {activeFilter === 'unread'
                  ? 'You have caught up with all notifications.'
                  : 'When you receive booking updates or new property reviews, they will appear right here.'}
              </p>
              <Link
                to="/properties"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Explore Stays</span>
              </Link>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n._id}
                className={`p-5 sm:p-6 flex items-start justify-between gap-4 hover:bg-slate-50/80 transition-colors group ${
                  !n.isRead ? 'bg-indigo-50/25' : ''
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
                            ? 'font-bold text-slate-900'
                            : 'font-semibold text-slate-700'
                        }`}
                      >
                        {n.title}
                      </h2>
                      {!n.isRead && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-extrabold">
                          New
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {n.message}
                    </p>

                    <div className="pt-1 flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                      <span>{formatTimestamp(n.createdAt)}</span>
                      {n.link && (
                        <>
                          <span>•</span>
                          <span className="text-indigo-600 font-semibold group-hover:underline flex items-center gap-1">
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
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
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
