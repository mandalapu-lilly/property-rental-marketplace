import React, { useState } from 'react';
import { Mail, Phone, Calendar, Send, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function InquiryModal({ isOpen, onClose, property, hostName }) {
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please write a message for the host.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post('/api/inquiries', {
        propertyId: property._id,
        message: message.trim(),
        phone: phone.trim(),
        preferredMoveInDate: moveInDate || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setMessage('');
        setPhone('');
        setMoveInDate('');
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#1c1c20] w-full max-w-lg rounded-3xl shadow-editorial-lg border border-[#e5e0d8] dark:border-[#27272a] overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="bg-[#18181b] dark:bg-[#121214] p-5 text-white flex items-center justify-between border-b border-[#27272a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#27272a] border border-[#3f3f46] flex items-center justify-center text-[#d4b996]">
              <Mail className="w-5 h-5 text-[#d4b996]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Contact Property Host</h3>
              <p className="text-xs text-[#a1a1aa]">Inquire about {property.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Inquiry Modal"
            className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-white dark:bg-[#1c1c20]">
          {success ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-[#18181b] dark:text-[#fbfbf9]">Inquiry Sent Successfully!</h4>
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] max-w-xs mx-auto">
                Host {hostName || 'owner'} has received your message and notification. They will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#18181b] dark:text-[#fbfbf9] mb-1">
                  Message for Host <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi, I am interested in renting this property. Is it available for immediate move-in? What is the policy regarding pets/parking?"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#e5e0d8] dark:border-[#27272a] bg-[#fbfbf9] dark:bg-[#141417] focus:outline-none focus:ring-2 focus:ring-[#b58d59] text-[#18181b] dark:text-[#fbfbf9] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#18181b] dark:text-[#fbfbf9] mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#b58d59] dark:text-[#d4b996]" />
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#e5e0d8] dark:border-[#27272a] bg-[#fbfbf9] dark:bg-[#141417] focus:outline-none focus:ring-2 focus:ring-[#b58d59] text-[#18181b] dark:text-[#fbfbf9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18181b] dark:text-[#fbfbf9] mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#b58d59] dark:text-[#d4b996]" />
                    Preferred Move-in Date
                  </label>
                  <input
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#e5e0d8] dark:border-[#27272a] bg-[#fbfbf9] dark:bg-[#141417] focus:outline-none focus:ring-2 focus:ring-[#b58d59] text-[#18181b] dark:text-[#fbfbf9]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#e8e3da] dark:border-[#27272a] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-[#71717a] dark:text-[#a1a1aa] hover:bg-[#f4f0e8] dark:hover:bg-[#27272a] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] dark:text-[#18181b] rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Inquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
