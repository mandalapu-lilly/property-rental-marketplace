import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Success message passed from registration
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      await login(email.trim(), password);
      // Redirect to original intended location or /dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      const serverMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Unable to log in. Please check your credentials and ensure the backend is running.';
      setError(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-[#fbfbf9] dark:bg-[#121214]">
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-[#1c1c20] rounded-[2.5rem] shadow-editorial-lg border border-[#e5e0d8] dark:border-[#27272a] overflow-hidden">
        {/* Left Side: Large Cinematic Architectural Hero Column */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-[#18181b] flex-col justify-between p-10 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-luminosity scale-105 transition-transform duration-1000 hover:scale-100"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Top Tag & Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <img
              src="/havenstay-logo.png"
              alt="HavenStay"
              className="h-10 w-auto object-contain brightness-0 invert"
            />
          </div>

          {/* Bottom Editorial Caption */}
          <div className="relative z-10 space-y-4">
            <div className="space-y-2">
              <h3 className="font-editorial text-3xl font-light tracking-tight text-white leading-tight">
                Designed for refined living & seamless escapes.
              </h3>
              <p className="text-xs text-[#d4cdc3] leading-relaxed font-normal">
                Unlock instant reservations, verified hosts, and transparent pricing in top destinations.
              </p>
            </div>

            <div className="pt-4 border-t border-white/20 flex items-center justify-between text-[11px] text-[#d4cdc3]">
              <span>Verified Stays</span>
              <span>•</span>
              <span>Direct Booking</span>
              <span>•</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Right Side: Minimal Login Card/Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-[#1c1c20]">
          <div className="max-w-md w-full mx-auto">
            {/* Form Header */}
            <div className="mb-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#71717a] dark:text-[#a1a1aa] block mb-2">
                Member Portal
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl font-light tracking-tight text-[#18181b] dark:text-[#fbfbf9]">
                Welcome Back
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#71717a] dark:text-[#a1a1aa]">
                Sign in to manage your bookings, saved homes, and host properties.
              </p>
            </div>

            {/* Success Banner */}
            {successMessage && !error && (
              <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Registration completed!</p>
                  <p className="text-emerald-700 dark:text-emerald-300 mt-0.5">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Authentication failed</p>
                  <p className="text-rose-700 dark:text-rose-300 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#18181b] dark:text-[#fbfbf9] mb-2" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a1a1aa]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="block w-full pl-10 pr-4 py-3 bg-[#fbfbf9] dark:bg-[#141417] border border-[#e5e0d8] dark:border-[#27272a] rounded-xl text-[#18181b] dark:text-[#fbfbf9] placeholder-[#a1a1aa] text-sm focus:outline-none focus:ring-1 focus:ring-[#b58d59] focus:border-[#b58d59] transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#18181b] dark:text-[#fbfbf9]" htmlFor="password">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[#71717a] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-[#d4b996] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a1a1aa]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-4 py-3 bg-[#fbfbf9] dark:bg-[#141417] border border-[#e5e0d8] dark:border-[#27272a] rounded-xl text-[#18181b] dark:text-[#fbfbf9] placeholder-[#a1a1aa] text-sm focus:outline-none focus:ring-1 focus:ring-[#b58d59] focus:border-[#b58d59] transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] active:scale-[0.98] text-white dark:text-[#18181b] text-xs font-semibold uppercase tracking-wider rounded-full shadow-editorial transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-[#f4f0e8] dark:border-[#27272a] text-center">
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
                Don't have an account yet?{' '}
                <Link to="/register" className="font-bold text-[#18181b] dark:text-[#d4b996] hover:underline underline-offset-4">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
