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
  Edit,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Search,
  Key,
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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <p className="text-slate-500 font-medium text-sm">Loading admin dashboard & data...</p>
      </div>
    );
  }

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

  const pendingVerificationCount = propertiesList.filter((p) => p.verificationStatus === 'pending').length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Administrator Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              System Management & Analytics
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Full control over accounts, property listings, verifications, bookings, and review moderation.
            </p>
          </div>

          <button
            onClick={loadAllData}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer w-fit"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh All Data</span>
          </button>
        </div>

        {/* Alerts */}
        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl font-bold flex justify-between items-center">
            <span>{message}</span>
            <button onClick={() => setMessage('')} className="underline">Dismiss</button>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { key: 'overview', label: 'Overview Metrics' },
            {
              key: 'verification',
              label: `Property Verification (${pendingVerificationCount} Pending)`,
              badge: pendingVerificationCount > 0,
            },
            { key: 'users', label: `Users (${usersList.length})` },
            { key: 'properties', label: `All Properties (${propertiesList.length})` },
            { key: 'bookings', label: `Bookings (${bookingsList.length})` },
            { key: 'reviews', label: `Reviews (${reviewsList.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Users */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Accounts</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{stats?.totalUsers || 0}</span>
                  <span className="text-xs text-slate-500 font-medium">({stats?.totalHosts || 0} Hosts)</span>
                </div>
              </div>

              {/* Properties */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Properties</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{stats?.totalProperties || 0}</span>
                  <span className="text-xs text-emerald-600 font-bold">({stats?.availableProperties || 0} Live)</span>
                </div>
              </div>

              {/* Bookings */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reservations</span>
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{stats?.totalBookings || 0}</span>
                  <span className="text-xs text-amber-600 font-bold">({stats?.pendingBookings || 0} Pending)</span>
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Reviews</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{stats?.totalReviews || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PROPERTY VERIFICATION MANAGEMENT */}
        {activeTab === 'verification' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: 'pending', label: `Pending (${propertiesList.filter((p) => p.verificationStatus === 'pending').length})` },
                { key: 'approved', label: `Approved / Verified (${propertiesList.filter((p) => p.verificationStatus === 'approved' || !p.verificationStatus).length})` },
                { key: 'rejected', label: `Rejected (${propertiesList.filter((p) => p.verificationStatus === 'rejected').length})` },
                { key: 'all', label: `All Listings (${propertiesList.length})` },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setVerificationFilter(filter.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    verificationFilter === filter.key
                      ? 'bg-slate-900 text-white shadow'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Properties Grid / Table */}
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
                      className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between space-y-4"
                    >
                      <div className="flex gap-4">
                        <img
                          src={
                            property.images && property.images.length > 0
                              ? property.images[0]
                              : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={property.title}
                          className="w-28 h-28 object-cover rounded-2xl bg-slate-100 shrink-0"
                        />

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : status === 'pending'
                                  ? 'bg-amber-100 text-amber-800 animate-pulse'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {status === 'approved' ? '✓ Verified' : status === 'pending' ? '⏳ Pending Review' : '✕ Rejected'}
                            </span>
                            <span className="text-xs font-bold text-slate-900">₹{property.price?.toLocaleString()}/mo</span>
                          </div>

                          <h3 className="font-bold text-slate-900 text-sm line-clamp-1" title={property.title}>
                            {property.title}
                          </h3>

                          <p className="text-xs text-slate-500 truncate">
                            {property.location}, {property.city} • {property.bedrooms} BHK {property.propertyType}
                          </p>

                          <div className="text-[11px] text-slate-500 pt-1">
                            <span>Host: </span>
                            <strong className="text-slate-800">{property.owner?.name || 'N/A'}</strong>
                            <span className="text-slate-400"> ({property.owner?.email})</span>
                          </div>
                        </div>
                      </div>

                      {/* Rejection Reason Display */}
                      {status === 'rejected' && property.rejectionReason && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                          <p className="font-bold">Rejection Note sent to Host:</p>
                          <p className="mt-0.5 text-rose-700">{property.rejectionReason}</p>
                        </div>
                      )}

                      {/* Inline Reject Input Form */}
                      {isRejecting && (
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                          <label className="block text-xs font-bold text-slate-700">
                            Reason for Rejection (Visible to Host):
                          </label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Please upload higher-resolution interior photos or provide exact street address."
                            value={rejectReasonInput}
                            onChange={(e) => setRejectReasonInput(e.target.value)}
                            className="w-full p-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setRejectingPropId(null);
                                setRejectReasonInput('');
                              }}
                              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleVerifyProperty(property._id, 'rejected', rejectReasonInput)}
                              disabled={!rejectReasonInput.trim()}
                              className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg shadow-sm"
                            >
                              Confirm Rejection
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <a
                          href={`/properties/${property._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                        >
                          View Listing ↗
                        </a>

                        <div className="flex items-center gap-2">
                          {status !== 'approved' && (
                            <button
                              onClick={() => handleVerifyProperty(property._id, 'approved')}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve & Verify</span>
                            </button>
                          )}

                          {status !== 'rejected' && !isRejecting && (
                            <button
                              onClick={() => {
                                setRejectingPropId(property._id);
                                setRejectReasonInput('');
                              }}
                              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1"
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

        {/* TAB 2: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {usersList.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/60">
                      <td className="p-4 font-bold text-slate-900">{u.name}</td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          disabled={u._id === user?.id || u._id === user?._id}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800"
                        >
                          <option value="user">user</option>
                          <option value="host">host</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="p-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        {u._id !== user?.id && u._id !== user?._id ? (
                          <button
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">You (Current)</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PROPERTIES MANAGEMENT */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="p-4">Property</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Rent</th>
                    <th className="p-4">Host</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {propertiesList.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/60">
                      <td className="p-4 font-bold text-slate-900 max-w-xs truncate">{p.title}</td>
                      <td className="p-4">{p.propertyType}</td>
                      <td className="p-4">{p.city}</td>
                      <td className="p-4 font-bold text-slate-900">₹{p.price?.toLocaleString()}</td>
                      <td className="p-4">{p.owner?.name}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            p.status === 'available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteProperty(p._id, p.title)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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

        {/* TAB 4: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="p-4">Property</th>
                    <th className="p-4">Guest</th>
                    <th className="p-4">Host</th>
                    <th className="p-4">Dates</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {bookingsList.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/60">
                      <td className="p-4 font-bold text-slate-900">{b.property?.title || 'N/A'}</td>
                      <td className="p-4">{b.user?.name}</td>
                      <td className="p-4">{b.host?.name}</td>
                      <td className="p-4">
                        {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-bold text-slate-900">₹{b.totalPrice?.toLocaleString()}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
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

        {/* TAB 5: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="p-4">Property</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Comment</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {reviewsList.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50/60">
                      <td className="p-4 font-bold text-slate-900">{r.property?.title || 'N/A'}</td>
                      <td className="p-4">{r.user?.name}</td>
                      <td className="p-4 font-bold text-amber-600">{r.rating} ★</td>
                      <td className="p-4 max-w-sm">{r.comment}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteReview(r._id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
