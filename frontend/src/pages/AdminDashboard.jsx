import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Users,
  Building,
  Calendar,
  Star,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [propertiesList, setPropertiesList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/admin/stats');
      setStats(res.data.stats);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError(err.response?.data?.error || 'Failed to load stats');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/admin/users');
      setUsersList(res.data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await api.get('/api/admin/properties');
      setPropertiesList(res.data.properties || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get('/api/bookings');
      setBookingsList(res.data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get('/api/reviews');
      setReviewsList(res.data.reviews || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    await Promise.all([fetchStats(), fetchUsers(), fetchProperties(), fetchBookings(), fetchReviews()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/api/admin/users/${userId}/role`, { role: newRole });
      setMessage(`User role updated to ${newRole}`);
      setUsersList((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${name}" and all their data?`)) {
      return;
    }
    try {
      await api.delete(`/api/admin/users/${userId}`);
      setMessage(`User "${name}" removed successfully.`);
      setUsersList((prev) => prev.filter((u) => u._id !== userId));
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleDeleteProperty = async (propId, title) => {
    if (!window.confirm(`Delete property "${title}"?`)) return;
    try {
      await api.delete(`/api/properties/${propId}`);
      setMessage(`Property "${title}" deleted.`);
      setPropertiesList((prev) => prev.filter((p) => p._id !== propId));
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete property');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review from the system?')) return;
    try {
      await api.delete(`/api/reviews/${reviewId}`);
      setMessage('Review deleted.');
      setReviewsList((prev) => prev.filter((r) => r._id !== reviewId));
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete review');
    }
  };

  const [verificationFilter, setVerificationFilter] = useState('pending');
  const [rejectingPropId, setRejectingPropId] = useState(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');

  const handleVerifyProperty = async (propertyId, status, reason = '') => {
    try {
      await api.put(`/api/admin/properties/${propertyId}/verify`, {
        status,
        rejectionReason: reason,
      });
      setMessage(`Property ${status === 'approved' ? 'approved & verified' : 'rejected'}`);
      setPropertiesList((prev) =>
        prev.map((p) =>
          p._id === propertyId
            ? { ...p, verificationStatus: status, rejectionReason: reason, verifiedAt: status === 'approved' ? new Date() : undefined }
            : p
        )
      );
      setRejectingPropId(null);
      setRejectReasonInput('');
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update verification status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center space-y-4 bg-[#fbfbf9] dark:bg-[#121214]">
        <div className="w-12 h-12 rounded-2xl bg-[#b58d59]/10 flex items-center justify-center text-[#b58d59] dark:text-[#d4b996] animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-stone-500 dark:text-stone-400 font-medium text-sm">Loading administrator command center...</p>
      </div>
    );
  }

  const pendingVerificationCount = propertiesList.filter((p) => p.verificationStatus === 'pending').length;

  return (
    <div className="min-h-screen bg-[#fbfbf9] dark:bg-[#121214] py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Console */}
        <div className="relative overflow-hidden bg-[#18181b] dark:bg-[#1c1c20] text-white p-8 sm:p-10 rounded-[32px] shadow-xl border border-stone-800 dark:border-white/10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#b58d59]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b58d59]/20 border border-[#b58d59]/30 text-[#d4b996] text-xs font-bold tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4b996]" />
                Root Command Console
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                Platform Administration
              </h1>
              <p className="text-stone-400 text-xs sm:text-sm max-w-xl leading-relaxed">
                Oversee platform inventory, audit host listings, manage user permissions, and moderate guest interactions.
              </p>
            </div>

            <button
              onClick={loadAllData}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs rounded-2xl backdrop-blur-md transition-all cursor-pointer w-fit border border-white/10"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync All Data</span>
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        {message && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs rounded-2xl font-bold flex justify-between items-center shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{message}</span>
            </div>
            <button onClick={() => setMessage('')} className="underline hover:text-emerald-950 dark:hover:text-emerald-200 cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {[
            { key: 'overview', label: 'Platform Metrics' },
            {
              key: 'verification',
              label: `Verifications (${pendingVerificationCount} Pending)`,
              badge: pendingVerificationCount > 0,
            },
            { key: 'users', label: `Accounts (${usersList.length})` },
            { key: 'properties', label: `Listings (${propertiesList.length})` },
            { key: 'bookings', label: `Reservations (${bookingsList.length})` },
            { key: 'reviews', label: `Ratings & Reviews (${reviewsList.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b] shadow-md shadow-stone-900/10'
                  : 'bg-white dark:bg-[#1c1c20] text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-white/10 hover:bg-stone-50 dark:hover:bg-[#27272a]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white dark:ring-[#1c1c20] animate-pulse"></span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Users */}
              <div className="bg-white dark:bg-[#1c1c20] p-6 rounded-3xl border border-stone-200/80 dark:border-white/10 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">Registered Accounts</span>
                  <div className="w-10 h-10 rounded-2xl bg-[#b58d59]/10 text-[#b58d59] dark:text-[#d4b996] flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-stone-900 dark:text-[#fbfbf9]">{stats?.totalUsers || 0}</span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold">({stats?.totalHosts || 0} Hosts)</span>
                </div>
              </div>

              {/* Properties */}
              <div className="bg-white dark:bg-[#1c1c20] p-6 rounded-3xl border border-stone-200/80 dark:border-white/10 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">Total Properties</span>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-stone-900 dark:text-[#fbfbf9]">{stats?.totalProperties || 0}</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">({stats?.availableProperties || 0} Live)</span>
                </div>
              </div>

              {/* Bookings */}
              <div className="bg-white dark:bg-[#1c1c20] p-6 rounded-3xl border border-stone-200/80 dark:border-white/10 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">Bookings Placed</span>
                  <div className="w-10 h-10 rounded-2xl bg-[#b58d59]/10 text-[#b58d59] dark:text-[#d4b996] flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-stone-900 dark:text-[#fbfbf9]">{stats?.totalBookings || 0}</span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">({stats?.pendingBookings || 0} Pending)</span>
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white dark:bg-[#1c1c20] p-6 rounded-3xl border border-stone-200/80 dark:border-white/10 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">Total Feedback</span>
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400 flex items-center justify-center">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-stone-900 dark:text-[#fbfbf9]">{stats?.totalReviews || 0}</span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold">Moderated Reviews</span>
                </div>
              </div>
            </div>

            {/* Deep Analytics Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Account Distribution */}
              <div className="bg-white dark:bg-[#1c1c20] p-6 rounded-3xl border border-stone-200/80 dark:border-white/10 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-stone-900 dark:text-[#fbfbf9] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#b58d59] dark:text-[#d4b996]" />
                  <span>Account Roles Distribution</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-2.5 rounded-2xl bg-stone-50 dark:bg-[#27272a]">
                    <span className="text-stone-600 dark:text-stone-400 font-medium">Renters / Guests</span>
                    <span className="font-bold text-stone-900 dark:text-[#fbfbf9]">
                      {Math.max(0, (stats?.totalUsers || 0) - (stats?.totalHosts || 0) - (stats?.totalAdmins || 0))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-2xl bg-[#b58d59]/10">
                    <span className="text-[#b58d59] dark:text-[#d4b996] font-medium">Property Hosts</span>
                    <span className="font-bold text-[#b58d59] dark:text-[#d4b996]">{stats?.totalHosts || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-2xl bg-stone-100 dark:bg-[#323238]">
                    <span className="text-stone-900 dark:text-stone-200 font-medium">System Administrators</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">{stats?.totalAdmins || 0}</span>
                  </div>
                </div>
              </div>

              {/* Property Verification Pipeline */}
              <div className="bg-white dark:bg-[#1c1c20] p-6 rounded-3xl border border-stone-200/80 dark:border-white/10 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-stone-900 dark:text-[#fbfbf9] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Property Verification Pipeline</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-2.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30">
                    <span className="text-emerald-900 dark:text-emerald-300 font-medium">Verified & Live</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {propertiesList.filter((p) => p.verificationStatus === 'approved' || !p.verificationStatus).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30">
                    <span className="text-amber-900 dark:text-amber-300 font-medium">Pending Audit</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {propertiesList.filter((p) => p.verificationStatus === 'pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30">
                    <span className="text-rose-900 dark:text-rose-300 font-medium">Rejected Submissions</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                      {propertiesList.filter((p) => p.verificationStatus === 'rejected').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Fulfillment */}
              <div className="bg-white dark:bg-[#1c1c20] p-6 rounded-3xl border border-stone-200/80 dark:border-white/10 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-stone-900 dark:text-[#fbfbf9] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#b58d59] dark:text-[#d4b996]" />
                  <span>Booking Lifecycle Status</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-2.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30">
                    <span className="text-emerald-900 dark:text-emerald-300 font-medium">Confirmed / Completed</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {(stats?.confirmedBookings || 0) + (stats?.completedBookings || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30">
                    <span className="text-amber-900 dark:text-amber-300 font-medium">Pending Confirmation</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{stats?.pendingBookings || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-2xl bg-stone-50 dark:bg-[#27272a]">
                    <span className="text-stone-600 dark:text-stone-400 font-medium">Cancelled Reservations</span>
                    <span className="font-bold text-stone-500 dark:text-stone-400">{stats?.cancelledBookings || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROPERTY VERIFICATION */}
        {activeTab === 'verification' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: 'pending', label: `Pending Review (${propertiesList.filter((p) => p.verificationStatus === 'pending').length})` },
                { key: 'approved', label: `Verified Listings (${propertiesList.filter((p) => p.verificationStatus === 'approved' || !p.verificationStatus).length})` },
                { key: 'rejected', label: `Rejected (${propertiesList.filter((p) => p.verificationStatus === 'rejected').length})` },
                { key: 'all', label: `All In Inventory (${propertiesList.length})` },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setVerificationFilter(filter.key)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    verificationFilter === filter.key
                      ? 'bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b] shadow-sm'
                      : 'bg-white dark:bg-[#1c1c20] text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-white/10 hover:bg-stone-100 dark:hover:bg-[#27272a]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {propertiesList
                .filter((p) => {
                  const status = p.verificationStatus || 'approved';
                  if (verificationFilter === 'all') return true;
                  return status === verificationFilter;
                })
                .map((property) => {
                  const status = property.verificationStatus || 'approved';
                  const isRejecting = rejectingPropId === property._id;

                  return (
                    <div
                      key={property._id}
                      className="bg-white dark:bg-[#1c1c20] rounded-3xl border border-stone-200/80 dark:border-white/10 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-stone-300 dark:hover:border-white/20 transition-all"
                    >
                      <div className="flex gap-4">
                        <img
                          src={
                            property.images && property.images.length > 0
                              ? property.images[0]
                              : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={property.title}
                          className="w-28 h-28 object-cover rounded-2xl bg-stone-100 dark:bg-[#27272a] shrink-0"
                        />

                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                status === 'approved'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                  : status === 'pending'
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 animate-pulse'
                                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                              }`}
                            >
                              {status === 'approved' ? '✓ Verified' : status === 'pending' ? '⏳ Needs Audit' : '✕ Rejected'}
                            </span>
                            <span className="text-xs font-black text-stone-900 dark:text-[#fbfbf9]">₹{property.price?.toLocaleString()}/mo</span>
                          </div>

                          <h3 className="font-bold text-stone-900 dark:text-[#fbfbf9] text-sm line-clamp-1" title={property.title}>
                            {property.title}
                          </h3>

                          <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                            {property.location}, {property.city} • {property.bedrooms} BHK {property.propertyType}
                          </p>

                          <div className="text-[11px] text-stone-500 dark:text-stone-400 pt-0.5">
                            <span>Host: </span>
                            <strong className="text-stone-800 dark:text-stone-200">{property.owner?.name || 'N/A'}</strong>
                            <span className="text-stone-400 dark:text-stone-500"> ({property.owner?.email})</span>
                          </div>
                        </div>
                      </div>

                      {/* Rejection Reason Display */}
                      {status === 'rejected' && property.rejectionReason && (
                        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/40 rounded-2xl text-xs text-rose-800 dark:text-rose-300">
                          <p className="font-bold">Rejection Note sent to Host:</p>
                          <p className="mt-0.5 text-rose-700 dark:text-rose-300">{property.rejectionReason}</p>
                        </div>
                      )}

                      {/* Inline Reject Input Form */}
                      {isRejecting && (
                        <div className="p-4 bg-stone-50 dark:bg-[#27272a] border border-stone-200 dark:border-white/10 rounded-2xl space-y-2.5">
                          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                            Reason for Rejection (Visible to Host):
                          </label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Please upload higher-resolution interior photos or verify complete street address."
                            value={rejectReasonInput}
                            onChange={(e) => setRejectReasonInput(e.target.value)}
                            className="w-full p-3 text-xs bg-white dark:bg-[#18181b] text-stone-900 dark:text-[#fbfbf9] placeholder:text-stone-400 dark:placeholder:text-stone-500 border border-stone-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setRejectingPropId(null);
                                setRejectReasonInput('');
                              }}
                              className="px-3.5 py-1.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-[#323238] rounded-xl cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleVerifyProperty(property._id, 'rejected', rejectReasonInput)}
                              disabled={!rejectReasonInput.trim()}
                              className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl shadow-sm cursor-pointer"
                            >
                              Confirm Rejection
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-white/5">
                        <a
                          href={`/properties/${property._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-[#b58d59] dark:text-[#d4b996] hover:text-[#916b3b] dark:hover:text-[#e0cbaf] flex items-center gap-1"
                        >
                          <span>Inspect Listing</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <div className="flex items-center gap-2">
                          {status !== 'approved' && (
                            <button
                              onClick={() => handleVerifyProperty(property._id, 'approved')}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {status !== 'rejected' && !isRejecting && (
                            <button
                              onClick={() => {
                                setRejectingPropId(property._id);
                                setRejectReasonInput('');
                              }}
                              className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 3: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-[#1c1c20] rounded-3xl border border-stone-200/80 dark:border-white/10 overflow-hidden shadow-sm animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600 dark:text-stone-300">
                <thead className="bg-stone-50 dark:bg-[#27272a] text-stone-700 dark:text-stone-200 font-bold uppercase text-[11px] border-b border-stone-200/80 dark:border-white/10">
                  <tr>
                    <th className="p-4 pl-6">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Assigned Role</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-white/5 font-medium">
                  {usersList.map((u) => (
                    <tr key={u._id} className="hover:bg-stone-50/80 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 pl-6 font-bold text-stone-900 dark:text-[#fbfbf9]">{u.name}</td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          disabled={u._id === user?.id || u._id === user?._id}
                          className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#27272a] border border-stone-200 dark:border-white/10 text-xs font-bold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-[#b58d59] cursor-pointer"
                        >
                          <option value="user" className="dark:bg-[#1c1c20]">user</option>
                          <option value="host" className="dark:bg-[#1c1c20]">host</option>
                          <option value="admin" className="dark:bg-[#1c1c20]">admin</option>
                        </select>
                      </td>
                      <td className="p-4 text-stone-400 dark:text-stone-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 pr-6 text-right">
                        {u._id !== user?.id && u._id !== user?._id ? (
                          <button
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#b58d59] dark:text-[#d4b996] font-bold bg-[#b58d59]/10 px-2.5 py-1 rounded-full">
                            Active Session
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PROPERTIES INVENTORY */}
        {activeTab === 'properties' && (
          <div className="bg-white dark:bg-[#1c1c20] rounded-3xl border border-stone-200/80 dark:border-white/10 overflow-hidden shadow-sm animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600 dark:text-stone-300">
                <thead className="bg-stone-50 dark:bg-[#27272a] text-stone-700 dark:text-stone-200 font-bold uppercase text-[11px] border-b border-stone-200/80 dark:border-white/10">
                  <tr>
                    <th className="p-4 pl-6">Listing</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Destination</th>
                    <th className="p-4">Monthly Rent</th>
                    <th className="p-4">Host</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-white/5 font-medium">
                  {propertiesList.map((p) => (
                    <tr key={p._id} className="hover:bg-stone-50/80 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 pl-6 font-bold text-stone-900 dark:text-[#fbfbf9] max-w-xs truncate">{p.title}</td>
                      <td className="p-4 capitalize">{p.propertyType}</td>
                      <td className="p-4">{p.city}</td>
                      <td className="p-4 font-bold text-stone-900 dark:text-[#fbfbf9]">₹{p.price?.toLocaleString()}</td>
                      <td className="p-4">{p.owner?.name}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            p.status === 'available'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : 'bg-stone-100 dark:bg-[#27272a] text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleDeleteProperty(p._id, p.title)}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                          title="Delete property"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="bg-white dark:bg-[#1c1c20] rounded-3xl border border-stone-200/80 dark:border-white/10 overflow-hidden shadow-sm animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600 dark:text-stone-300">
                <thead className="bg-stone-50 dark:bg-[#27272a] text-stone-700 dark:text-stone-200 font-bold uppercase text-[11px] border-b border-stone-200/80 dark:border-white/10">
                  <tr>
                    <th className="p-4 pl-6">Property</th>
                    <th className="p-4">Renter</th>
                    <th className="p-4">Host</th>
                    <th className="p-4">Dates</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4 pr-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-white/5 font-medium">
                  {bookingsList.map((b) => (
                    <tr key={b._id} className="hover:bg-stone-50/80 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 pl-6 font-bold text-stone-900 dark:text-[#fbfbf9]">{b.property?.title || 'N/A'}</td>
                      <td className="p-4">{b.user?.name}</td>
                      <td className="p-4">{b.host?.name}</td>
                      <td className="p-4">
                        {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-bold text-stone-900 dark:text-[#fbfbf9]">₹{b.totalPrice?.toLocaleString()}</td>
                      <td className="p-4 pr-6">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 dark:bg-[#27272a] text-stone-800 dark:text-stone-200">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="bg-white dark:bg-[#1c1c20] rounded-3xl border border-stone-200/80 dark:border-white/10 overflow-hidden shadow-sm animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600 dark:text-stone-300">
                <thead className="bg-stone-50 dark:bg-[#27272a] text-stone-700 dark:text-stone-200 font-bold uppercase text-[11px] border-b border-stone-200/80 dark:border-white/10">
                  <tr>
                    <th className="p-4 pl-6">Listing</th>
                    <th className="p-4">Reviewer</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Feedback Content</th>
                    <th className="p-4 pr-6 text-right">Moderate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-white/5 font-medium">
                  {reviewsList.map((r) => (
                    <tr key={r._id} className="hover:bg-stone-50/80 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 pl-6 font-bold text-stone-900 dark:text-[#fbfbf9]">{r.property?.title || 'N/A'}</td>
                      <td className="p-4">{r.user?.name}</td>
                      <td className="p-4 font-bold text-amber-500">{r.rating} ★</td>
                      <td className="p-4 max-w-sm leading-relaxed">{r.comment}</td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleDeleteReview(r._id)}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
