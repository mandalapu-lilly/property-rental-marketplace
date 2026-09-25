import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Lock, KeyRound, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState(searchParams.get('token') || '');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');
    if (urlToken) setToken(urlToken);
    if (urlEmail) setEmail(urlEmail);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Please provide both new password and confirm password.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/api/auth/reset-password', {
        token: token.trim(),
        email: email.trim(),
        newPassword,
        confirmPassword,
      });

      setSuccess(true);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Password reset failed. The token may be expired or invalid. Please request a new link.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-[#fbfbf9] dark:bg-[#121214]">
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-[#1c1c20] rounded-3xl shadow-editorial-lg border border-[#e5e0d8] dark:border-[#27272a] overflow-hidden">
        {/* Left Side: Architectural Visual Hero Column */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-[#18181b] flex-col justify-between p-10 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-[#d4b996]">
              <KeyRound className="w-3.5 h-3.5 text-[#d4b996]" />
              <span>Password Update</span>
            </div>
          </div>

          <div className="relative z-10 space-y-3">
            <h3 className="font-editorial text-2xl font-light tracking-tight text-white leading-snug">
              Set your new password
            </h3>
            <p className="text-xs text-[#d4cdc3] leading-relaxed">
              Create a unique password to safeguard your bookings, listings, and account settings.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white dark:bg-[#1c1c20]">
          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="lg:hidden inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4f0e8] dark:bg-[#27272a] text-[#b58d59] dark:text-[#d4b996] text-xs font-semibold mb-3 border border-[#ded7cb] dark:border-[#3f3f46]">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Security</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-light tracking-tight text-[#18181b] dark:text-[#fbfbf9]">
                Create new password
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-[#71717a] dark:text-[#a1a1aa]">
                Choose a strong password with at least 6 characters.
              </p>
            </div>

            {/* Success Banner */}
            {success ? (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#18181b] dark:text-[#fbfbf9]">Password reset complete!</h3>
                  <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] mt-1.5">
                    Your password has been successfully updated. You can now sign in with your new credentials.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    navigate('/login', {
                      state: { message: 'Password updated successfully! Please log in with your new password.' },
                    })
                  }
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full shadow-editorial text-xs font-semibold uppercase tracking-wider text-white bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] dark:text-[#18181b] transition-all cursor-pointer"
                >
                  <span>Go to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {/* Error Banner */}
                {error && (
                  <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs sm:text-sm animate-shake">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Reset Failed</p>
                      <p className="text-rose-700 dark:text-rose-300 mt-0.5">{error}</p>
                    </div>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Reset Token field (if not provided in URL) */}
                  {!searchParams.get('token') && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#18181b] dark:text-[#fbfbf9] mb-1.5" htmlFor="token">
                        Reset Token / Verification Code
                      </label>
                      <div className="relative rounded-xl">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a1a1aa]">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <input
                          id="token"
                          name="token"
                          type="text"
                          required
                          value={token}
                          onChange={(e) => setToken(e.target.value)}
                          placeholder="Paste reset token here..."
                          className="block w-full pl-10 pr-4 py-2.5 bg-[#fbfbf9] dark:bg-[#141417] border border-[#e5e0d8] dark:border-[#27272a] rounded-xl text-[#18181b] dark:text-[#fbfbf9] placeholder-[#a1a1aa] text-sm focus:outline-none focus:ring-1 focus:ring-[#b58d59] font-mono transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#18181b] dark:text-[#fbfbf9] mb-1.5" htmlFor="newPassword">
                      New Password
                    </label>
                    <div className="relative rounded-xl">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a1a1aa]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="block w-full pl-10 pr-10 py-2.5 bg-[#fbfbf9] dark:bg-[#141417] border border-[#e5e0d8] dark:border-[#27272a] rounded-xl text-[#18181b] dark:text-[#fbfbf9] placeholder-[#a1a1aa] text-sm focus:outline-none focus:ring-1 focus:ring-[#b58d59] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#71717a] hover:text-[#18181b] dark:text-[#a1a1aa] dark:hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#18181b] dark:text-[#fbfbf9] mb-1.5" htmlFor="confirmPassword">
                      Confirm New Password
                    </label>
                    <div className="relative rounded-xl">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a1a1aa]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat your new password"
                        className="block w-full pl-10 pr-4 py-2.5 bg-[#fbfbf9] dark:bg-[#141417] border border-[#e5e0d8] dark:border-[#27272a] rounded-xl text-[#18181b] dark:text-[#fbfbf9] placeholder-[#a1a1aa] text-sm focus:outline-none focus:ring-1 focus:ring-[#b58d59] transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full shadow-editorial text-xs font-semibold uppercase tracking-wider text-white bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] dark:text-[#18181b] active:scale-[0.99] disabled:opacity-60 transition-all cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Updating password...</span>
                        </>
                      ) : (
                        <>
                          <span>Reset Password</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 pt-6 border-t border-[#f4f0e8] dark:border-[#27272a] flex items-center justify-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-[#d4b996] transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
