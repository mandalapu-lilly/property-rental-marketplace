import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Shield,
  Key,
  Calendar,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileError('');

    if (!name.trim()) {
      setProfileError('Name cannot be empty.');
      return;
    }

    setSavingProfile(true);

    try {
      const res = await api.put('/api/auth/profile', { name: name.trim() });
      setProfileMessage('Name updated successfully!');
      // Update local storage
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, name: name.trim() }));
    } catch (err) {
      setProfileError(err.response?.data?.error || 'Failed to update name');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill out all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setSavingPassword(true);

    try {
      await api.put('/api/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setPasswordMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] dark:bg-[#121214] py-10 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Card Header */}
        <div className="bg-white dark:bg-[#1c1c20] p-7 sm:p-9 rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#18181b] dark:bg-[#121214] border border-transparent dark:border-[#3f3f46] text-white dark:text-[#d4b996] flex items-center justify-center font-editorial italic text-2xl uppercase shadow-md">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-editorial text-2xl sm:text-3xl font-light text-[#18181b] dark:text-[#f4f0e8] tracking-tight">{user?.name}</h1>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] border border-[#e5e0d8] dark:border-[#3f3f46]">
                  {user?.role || 'user'}
                </span>
              </div>
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-900/50 w-fit uppercase tracking-wider text-[10px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Authenticated Member</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Details Form */}
          <div className="bg-white dark:bg-[#1c1c20] p-7 sm:p-8 rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial space-y-6">
            <h2 className="font-editorial text-lg font-bold text-[#18181b] dark:text-[#f4f0e8] flex items-center gap-2 border-b border-[#f4f0e8] dark:border-[#2e2e34] pb-3">
              <User className="w-4 h-4 text-[#b58d59]" />
              <span>Personal Identity</span>
            </h2>

            {profileMessage && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs rounded-2xl font-bold animate-fadeIn">
                {profileMessage}
              </div>
            )}

            {profileError && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 text-xs rounded-2xl font-bold animate-fadeIn">
                {profileError}
              </div>
            )}

            <form onSubmit={handleUpdateName} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-[0.2em]" htmlFor="profile-name">
                  Full Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#fbfbf9] dark:bg-[#121214] border border-[#e5e0d8] dark:border-[#3f3f46] rounded-2xl text-xs font-medium text-[#18181b] dark:text-[#f4f0e8] focus:outline-none focus:ring-1 focus:ring-[#b58d59] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-[0.2em]" htmlFor="profile-email">
                  Email Address
                </label>
                <input
                  id="profile-email"
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-4 py-3 bg-[#f4f0e8] dark:bg-[#27272a] border border-[#e5e0d8] dark:border-[#3f3f46] rounded-2xl text-xs text-[#71717a] dark:text-[#a1a1aa] font-medium cursor-not-allowed"
                />
                <span className="text-[10px] text-[#71717a] dark:text-[#a1a1aa] pl-1 block">Account login email is permanently verified.</span>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-3.5 px-5 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] active:scale-[0.98] text-white dark:text-[#18181b] font-semibold text-xs uppercase tracking-wider rounded-full shadow-editorial transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Profile Info</span>
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white dark:bg-[#1c1c20] p-7 sm:p-8 rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial space-y-6">
            <h2 className="font-editorial text-lg font-bold text-[#18181b] dark:text-[#f4f0e8] flex items-center gap-2 border-b border-[#f4f0e8] dark:border-[#2e2e34] pb-3">
              <Lock className="w-4 h-4 text-[#b58d59]" />
              <span>Update Password</span>
            </h2>

            {passwordMessage && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs rounded-2xl font-bold animate-fadeIn">
                {passwordMessage}
              </div>
            )}

            {passwordError && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 text-xs rounded-2xl font-bold animate-fadeIn">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-[0.2em]" htmlFor="cur-pass">
                  Current Password *
                </label>
                <input
                  id="cur-pass"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#fbfbf9] dark:bg-[#121214] border border-[#e5e0d8] dark:border-[#3f3f46] rounded-2xl text-xs font-medium text-[#18181b] dark:text-[#f4f0e8] focus:outline-none focus:ring-1 focus:ring-[#b58d59] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-[0.2em]" htmlFor="new-pass">
                  New Password *
                </label>
                <input
                  id="new-pass"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-3 bg-[#fbfbf9] dark:bg-[#121214] border border-[#e5e0d8] dark:border-[#3f3f46] rounded-2xl text-xs font-medium text-[#18181b] dark:text-[#f4f0e8] focus:outline-none focus:ring-1 focus:ring-[#b58d59] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-[0.2em]" htmlFor="conf-pass">
                  Confirm New Password *
                </label>
                <input
                  id="conf-pass"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3 bg-[#fbfbf9] dark:bg-[#121214] border border-[#e5e0d8] dark:border-[#3f3f46] rounded-2xl text-xs font-medium text-[#18181b] dark:text-[#f4f0e8] focus:outline-none focus:ring-1 focus:ring-[#b58d59] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="w-full py-3.5 px-5 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] active:scale-[0.98] text-white dark:text-[#18181b] font-semibold text-xs uppercase tracking-wider rounded-full shadow-editorial transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                <span>Update Password</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
