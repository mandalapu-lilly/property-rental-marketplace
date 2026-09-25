import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      return 'All fields are required.';
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address.';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.name.trim(), formData.email.trim(), formData.password, formData.role);
      // Redirect to /login with a flash success state
      navigate('/login', {
        state: {
          message: 'Account created successfully! Please sign in with your credentials.',
        },
      });
    } catch (err) {
      const serverMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Registration failed. Please try again.';
      setError(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-[#fbfbf9]">
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[2.5rem] shadow-editorial-lg border border-[#e5e0d8] overflow-hidden">
        {/* Left Side: Architectural Visual Column (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-[#18181b] flex-col justify-between p-10 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-luminosity scale-105 transition-transform duration-1000 hover:scale-100"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Top Tag */}
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#e5e0d8] block">
              Join HavenStay
            </span>
          </div>

          {/* Bottom Caption */}
          <div className="relative z-10 space-y-4">
            <div className="space-y-2">
              <h3 className="font-editorial text-3xl font-light tracking-tight text-white leading-tight">
                Discover extraordinary homes or share your sanctuary.
              </h3>
              <p className="text-xs text-[#d4cdc3] leading-relaxed font-normal">
                Connect with thousands of discerning travelers and property owners across prime metropolitan hubs and scenic retreats.
              </p>
            </div>

            <div className="pt-4 border-t border-white/20 flex items-center justify-between text-[11px] text-[#d4cdc3]">
              <span>Verified Superhosts</span>
              <span>•</span>
              <span>Direct Bookings</span>
              <span>•</span>
              <span>Zero Hidden Fees</span>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            {/* Form Header */}
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#71717a] block mb-2">
                New Membership
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl font-light tracking-tight text-[#18181b]">
                Create Account
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#71717a]">
                Join our community to reserve exceptional stays or list your properties.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Registration issue</p>
                  <p className="text-rose-700 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#18181b] mb-1.5" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a1a1aa]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Amulya Mandalapu"
                    className="block w-full pl-10 pr-4 py-2.5 bg-[#fbfbf9] border border-[#e5e0d8] rounded-xl text-[#18181b] placeholder-[#a1a1aa] text-sm focus:outline-none focus:ring-1 focus:ring-[#18181b] focus:border-[#18181b] transition-all"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#18181b] mb-1.5" htmlFor="email">
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
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="block w-full pl-10 pr-4 py-2.5 bg-[#fbfbf9] border border-[#e5e0d8] rounded-xl text-[#18181b] placeholder-[#a1a1aa] text-sm focus:outline-none focus:ring-1 focus:ring-[#18181b] focus:border-[#18181b] transition-all"
                  />
                </div>
              </div>

              {/* Account Role Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#18181b] mb-1.5" htmlFor="role">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'user' })}
                    className={`py-2.5 px-3 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      formData.role === 'user'
                        ? 'border-[#18181b] bg-[#18181b] text-white shadow-sm'
                        : 'border-[#e5e0d8] bg-[#fbfbf9] text-[#71717a] hover:bg-[#f4f0e8]'
                    }`}
                  >
                    Renter / Guest
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'host' })}
                    className={`py-2.5 px-3 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      formData.role === 'host'
                        ? 'border-[#18181b] bg-[#18181b] text-white shadow-sm'
                        : 'border-[#e5e0d8] bg-[#fbfbf9] text-[#71717a] hover:bg-[#f4f0e8]'
                    }`}
                  >
                    Property Host
                  </button>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#18181b] mb-1.5" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a1a1aa]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className="block w-full pl-10 pr-4 py-2.5 bg-[#fbfbf9] border border-[#e5e0d8] rounded-xl text-[#18181b] placeholder-[#a1a1aa] text-sm focus:outline-none focus:ring-1 focus:ring-[#18181b] focus:border-[#18181b] transition-all"
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#18181b] mb-1.5" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a1a1aa]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="block w-full pl-10 pr-4 py-2.5 bg-[#fbfbf9] border border-[#e5e0d8] rounded-xl text-[#18181b] placeholder-[#a1a1aa] text-sm focus:outline-none focus:ring-1 focus:ring-[#18181b] focus:border-[#18181b] transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full shadow-editorial text-xs font-semibold uppercase tracking-wider text-white bg-[#18181b] hover:bg-black active:scale-[0.98] disabled:opacity-60 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Link to Login */}
            <div className="mt-6 pt-6 border-t border-[#f4f0e8] text-center">
              <p className="text-xs text-[#71717a]">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-[#18181b] hover:underline underline-offset-4"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
