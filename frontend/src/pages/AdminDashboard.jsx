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
              Full control over accounts, active property listings, bookings, and review moderation.
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
            { key: 'users', label: `Users (${usersList.length})` },
            { key: 'properties', label: `Properties (${propertiesList.length})` },
            { key: 'bookings', label: `Bookings (${bookingsList.length})` },
            { key: 'reviews', label: `Reviews (${reviewsList.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
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
