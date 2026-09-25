import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#b58d59] dark:text-[#d4b996] mb-2" />
        <p className="text-sm text-[#71717a] dark:text-[#a1a1aa] font-medium">Verifying session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check if specific roles are required
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user?.role)) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#fbfbf9] dark:bg-[#121214]">
          <div className="bg-white dark:bg-[#1c1c20] p-8 rounded-3xl border border-[#e5e0d8] dark:border-[#27272a] text-center max-w-md shadow-editorial space-y-4">
            <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-800/50">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-[#18181b] dark:text-[#fbfbf9]">Access Restricted</h2>
            <p className="text-[#71717a] dark:text-[#a1a1aa] text-sm">
              Your account role (<strong className="text-[#18181b] dark:text-[#fbfbf9] capitalize">{user?.role || 'user'}</strong>) does not have permission to access this page.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                to="/dashboard"
                className="px-5 py-2.5 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] font-semibold text-xs rounded-xl transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/properties"
                className="px-5 py-2.5 bg-[#f4f0e8] dark:bg-[#27272a] hover:bg-[#eae3d6] dark:hover:bg-[#3f3f46] text-[#18181b] dark:text-[#fbfbf9] font-semibold text-xs rounded-xl transition-colors"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  return children;
}
