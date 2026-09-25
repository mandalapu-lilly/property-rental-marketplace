import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Mail, KeyRound, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post('/api/auth/forgot-password', {
        email: email.trim(),
      });

      setSuccess(true);
      if (res.data?.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Unable to process password reset request. Please check the email address and try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-[#fbfbf9]">
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[2.5rem] shadow-editorial-lg border border-[#e5e0d8] overflow-hidden">
        {/* Left Side: Architectural Visual Hero Column */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-[#18181b] flex-col justify-between p-10 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#e5e0d8] block">
              Account Security
            </span>
          </div>

          <div className="relative z-10 space-y-3">
            <h3 className="font-editorial text-3xl font-light tracking-tight text-white leading-tight">
              Secure & Instant Password Recovery
            </h3>
            <p className="text-xs text-[#d4cdc3] leading-relaxed font-normal">
              We'll securely verify your identity and generate a single-use password reset token.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#71717a] block mb-2">
                Recovery
              </span>
              <h2 className="font-editorial text-4xl font-light tracking-tight text-[#18181b]">
                Reset Password
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#71717a]">
                Enter your account email and we'll generate a secure reset link.
              </p>
            </div>

            {/* Success Banner */}
            {success && (
              <div className="mb-6 space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Reset token generated!</p>
                    <p className="text-emerald-700 mt-1">
                      A password reset session has been initialized for <strong className="font-bold">{email}</strong>.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full shadow-editorial text-xs font-semibold uppercase tracking-wider text-white bg-[#18181b] hover:bg-black transition-all cursor-pointer"
                >
                  <span>Proceed to Set New Password</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Request Failed</p>
                  <p className="text-rose-700 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {!success && (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#18181b] mb-2" htmlFor="email">
                    Account Email Address
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
                      className="block w-full pl-10 pr-4 py-3 bg-[#fbfbf9] border border-[#e5e0d8] rounded-xl text-[#18181b] placeholder-[#a1a1aa] text-sm focus:outline-none focus:ring-1 focus:ring-[#18181b] focus:border-[#18181b] transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full shadow-editorial text-xs font-semibold uppercase tracking-wider text-white bg-[#18181b] hover:bg-black active:scale-[0.98] disabled:opacity-60 transition-all cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating link...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-[#f4f0e8] flex items-center justify-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#71717a] hover:text-[#18181b] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
