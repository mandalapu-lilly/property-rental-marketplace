import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Building2, Mail, KeyRound, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

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
    <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/70">
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden">
        {/* Left Side: Architectural Visual Hero Column */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-slate-900 flex-col justify-between p-10 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-indigo-200">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Account Security</span>
            </div>
          </div>

          <div className="relative z-10 space-y-3">
            <h3 className="text-xl font-bold tracking-tight text-white leading-snug">
              Secure & Instant Password Recovery
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We'll help you securely verify your identity and generate a password reset token.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6">
              <div className="lg:hidden inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Account Recovery</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Reset your password
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
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
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-slate-900 hover:bg-indigo-600 transition-all cursor-pointer"
                >
                  <span>Proceed to Set New Password</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs sm:text-sm animate-shake">
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2" htmlFor="email">
                    Account Email address
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

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-slate-900 hover:bg-indigo-600 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-60 transition-all cursor-pointer"
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

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
