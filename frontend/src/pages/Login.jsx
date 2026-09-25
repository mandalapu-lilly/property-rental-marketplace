import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Mail, Lock, AlertCircle, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

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
    <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/70">
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden">
        {/* Left Side: Architectural Visual Hero Column (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-slate-900 flex-col justify-between p-10 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000 hover:scale-100"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

          {/* Top Branding Tag */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-indigo-200">
              <Building2 className="w-3.5 h-3.5" />
              <span>HavenStay Residences</span>
            </div>
          </div>

          {/* Bottom Testimonial / Value Prop */}
          <div className="relative z-10 space-y-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight text-white leading-snug">
                Experience exceptional stays, curated for discerning travelers.
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unlock instant reservations, verified hosts, and transparent pricing in top destinations.
              </p>
            </div>

            <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs text-slate-400">
              <span>Verified Superhosts</span>
              <span>•</span>
              <span>Instant Confirmation</span>
              <span>•</span>
              <span>24/7 Concierge</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            {/* Form Header */}
            <div className="mb-8">
              <div className="lg:hidden inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
                <Building2 className="w-3.5 h-3.5" />
                <span>HavenStay</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome back
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
                Enter your credentials to access your trips, saved homes, and host hub.
              </p>
            </div>

            {/* Success Banner (e.g. after registration) */}
            {successMessage && !error && (
              <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Registration completed!</p>
                  <p className="text-emerald-700 mt-0.5">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs sm:text-sm animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Authentication failed</p>
                  <p className="text-rose-700 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2" htmlFor="email">
                  Email address
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700" htmlFor="password">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-slate-900 hover:bg-indigo-600 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-60 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Demo Credentials Assistant */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600">
              <div className="font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Quick Demo Credentials:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500">
                <div>
                  <span className="font-semibold text-slate-700">Renter:</span> user@example.com (pass: password123)
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Host:</span> host@example.com (pass: password123)
                </div>
              </div>
            </div>

            {/* Link to Register */}
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs sm:text-sm text-slate-600">
                Don't have an account yet?{' '}
                <Link
                  to="/register"
                  className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors underline-offset-2 hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
