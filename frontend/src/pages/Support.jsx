import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HelpCircle,
  Search,
  BookOpen,
  CreditCard,
  CalendarX,
  UserCheck,
  Building,
  Star,
  MessageSquare,
  ChevronDown,
  Mail,
  Send,
  CheckCircle2,
  PhoneCall,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
  LifeBuoy,
} from 'lucide-react';

const FAQ_SECTIONS = [
  {
    id: 'booking',
    title: 'Booking Help',
    icon: BookOpen,
    description: 'Reservations, check-in details, and dates',
    questions: [
      {
        q: 'How do I complete a reservation on HavenStay?',
        a: 'Browse through our curated properties on the Explore page, select your preferred check-in and check-out dates, specify guest numbers, and click "Reserve Stay". You will receive instant booking confirmation along with full itinerary details.',
      },
      {
        q: 'Can I request early check-in or late check-out?',
        a: 'Yes, early check-in or late check-out requests can be communicated directly with your host via property inquiries or special requests in your booking notes. Approval depends on host availability and cleaning schedules.',
      },
      {
        q: 'Where can I find my active and upcoming reservations?',
        a: 'Navigate to your Guest Dashboard or "My Bookings" in your profile menu to view confirmed check-in codes, host contact information, and downloadable itineraries.',
      },
    ],
  },
  {
    id: 'payment',
    title: 'Payment & Pricing',
    icon: CreditCard,
    description: 'Rates, taxes, invoices, and security deposits',
    questions: [
      {
        q: 'What is included in the nightly rental price?',
        a: 'Nightly rates include the accommodation fee, standard high-speed utilities, curated amenities, and access to common property spaces. Exact tax and platform service fee breakdowns are displayed clearly before booking confirmation.',
      },
      {
        q: 'When is payment charged for a stay?',
        a: 'Payment is confirmed upon booking confirmation to secure the property calendar for your selected dates. We accept major credit cards, debit cards, UPI, and verified net banking.',
      },
      {
        q: 'How do security deposits work?',
        a: 'Select premium luxury residences may require a refundable security deposit. If applicable, this is authorized upon check-in and released in full within 48 hours after check-out following property inspection.',
      },
    ],
  },
  {
    id: 'cancellation',
    title: 'Cancellation & Refunds',
    icon: CalendarX,
    description: 'Refund policies, timeline, and rescheduling',
    questions: [
      {
        q: 'What is HavenStay’s standard cancellation policy?',
        a: 'Most properties offer flexible cancellation with full refunds up to 48 hours prior to the scheduled check-in date. Strict or moderate policies for peak holidays are highlighted directly on the property card.',
      },
      {
        q: 'How long does it take to process a refund?',
        a: 'Refunds are initiated immediately upon cancellation approval and typically reflect on your original payment source within 3 to 5 business days.',
      },
      {
        q: 'Can I reschedule my stay dates instead of cancelling?',
        a: 'Yes, you can modify your dates from the "My Bookings" dashboard subject to property availability and any differences in seasonal nightly rates.',
      },
    ],
  },
  {
    id: 'account',
    title: 'Account & Security',
    icon: UserCheck,
    description: 'Password reset, profile settings, and roles',
    questions: [
      {
        q: 'How do I change or reset my account password?',
        a: 'If you are signed in, visit your Profile page under "Update Password". If you have forgotten your password, use the "Forgot Password" link on the Sign In page to receive a secure recovery code.',
      },
      {
        q: 'What are the password security requirements?',
        a: 'HavenStay enforces strong credentials: at least 8 characters including one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).',
      },
      {
        q: 'How do I switch between a Renter and Host account?',
        a: 'You can register or upgrade to a Host profile anytime to list your residences, set seasonal prices, and manage guest reservations through the dedicated Host Hub.',
      },
    ],
  },
  {
    id: 'property',
    title: 'Property & Stay Issues',
    icon: Building,
    description: 'On-site amenities, access, and host support',
    questions: [
      {
        q: 'What should I do if an amenity is not working during my stay?',
        a: 'Please contact your host immediately via the host contact details provided in your itinerary. If the issue is not resolved within 2 hours, contact our 24/7 HavenStay Concierge support for swift re-accommodation or technical assistance.',
      },
      {
        q: 'Are properties cleaned and sanitized before arrival?',
        a: 'Yes, all HavenStay properties adhere to strict cleanliness and luxury hygiene standards, including thorough sanitization and fresh linens prior to guest check-in.',
      },
    ],
  },
  {
    id: 'reviews',
    title: 'Reviews & Feedback',
    icon: Star,
    description: 'Verified ratings, community guidelines, and feedback',
    questions: [
      {
        q: 'Who is eligible to write a property review?',
        a: 'Only guests with verified, completed reservations can submit reviews and ratings. This ensures 100% authentic community feedback for all travelers.',
      },
      {
        q: 'Can hosts respond to guest reviews?',
        a: 'Yes, hosts can post public responses to feedback to offer helpful context and address guest remarks transparently.',
      },
    ],
  },
  {
    id: 'general',
    title: 'General Questions',
    icon: HelpCircle,
    description: 'Platform rules, verified superhosts, and assistance',
    questions: [
      {
        q: 'What does the "Verified Superhost" badge mean?',
        a: 'Verified Superhosts are seasoned hosts with outstanding 4.8+ ratings, zero unjustified cancellations, and proven track records of exceptional hospitality.',
      },
      {
        q: 'How can I compare multiple properties side-by-side?',
        a: 'Use the "Add to Compare" button on any property card to open the comparative matrix, comparing square footage, price per night, amenities, and guest capacities at a glance.',
      },
    ],
  },
];

export default function Support() {
  const { user } = useAuth();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: 'Booking Assistance',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle FAQ accordion
  const toggleFaq = (key) => {
    setOpenFaq(openFaq === key ? null : key);
  };

  // Filter questions based on category and search query
  const filteredSections = FAQ_SECTIONS.map((section) => {
    const isCategoryMatch = activeCategory === 'all' || activeCategory === section.id;
    if (!isCategoryMatch) return null;

    const filteredQuestions = section.questions.filter((item) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        item.q.toLowerCase().includes(query) ||
        item.a.toLowerCase().includes(query) ||
        section.title.toLowerCase().includes(query)
      );
    });

    if (filteredQuestions.length === 0) return null;

    return {
      ...section,
      questions: filteredQuestions,
    };
  }).filter(Boolean);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setFormError('Please fill out all required fields.');
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(contactForm.email.trim())) {
      setFormError('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);

    // Simulate instant support submission
    setTimeout(() => {
      const generatedTicket = 'HVN-' + Math.floor(100000 + Math.random() * 900000);
      setTicketId(generatedTicket);
      setFormSubmitted(true);
      setIsSubmitting(false);
      setContactForm({
        name: user?.name || '',
        email: user?.email || '',
        subject: 'Booking Assistance',
        message: '',
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] dark:bg-[#121214] text-[#18181b] dark:text-[#f4f0e8] py-10 sm:py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 1. HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#71717a] dark:text-[#a1a1aa] block">
            HAVENSTAY HELP CENTER & CONCIERGE
          </span>
          <h1 className="font-editorial text-4xl sm:text-6xl font-light tracking-tight text-[#18181b] dark:text-[#fbfbf9] uppercase">
            How Can We Assist You?
          </h1>
          <p className="text-xs sm:text-sm text-[#71717a] dark:text-[#a1a1aa] max-w-xl mx-auto font-normal leading-relaxed">
            Find immediate answers regarding bookings, payments, stay policies, or connect directly with our dedicated concierge support.
          </p>

          {/* Quick Search Input */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#a1a1aa]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics: reservations, refunds, check-in..."
                className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#27272a] rounded-full text-xs sm:text-sm font-medium text-[#18181b] dark:text-[#fbfbf9] placeholder-[#a1a1aa] shadow-editorial-sm focus:outline-none focus:ring-1 focus:ring-[#b58d59] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-semibold text-[#71717a] hover:text-[#18181b] dark:hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. THREE KEY ASSISTANCE CHANNELS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-[2rem] bg-white dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#27272a] shadow-editorial flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center shrink-0 border border-[#e5e0d8] dark:border-[#3f3f46]">
              <Mail className="w-5 h-5 text-[#b58d59] dark:text-[#d4b996]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-editorial text-lg font-bold text-[#18181b] dark:text-[#fbfbf9]">
                Concierge Email
              </h3>
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
                support@havenstay.com
              </p>
              <span className="inline-block pt-1 text-[11px] font-semibold text-[#b58d59] dark:text-[#d4b996]">
                Average response: &lt; 2 hours
              </span>
            </div>
          </div>

          <div className="p-7 rounded-[2rem] bg-white dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#27272a] shadow-editorial flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center shrink-0 border border-[#e5e0d8] dark:border-[#3f3f46]">
              <PhoneCall className="w-5 h-5 text-[#b58d59] dark:text-[#d4b996]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-editorial text-lg font-bold text-[#18181b] dark:text-[#fbfbf9]">
                Direct Stay Hotline
              </h3>
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
                +91 1800 200 4283
              </p>
              <span className="inline-block pt-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                Available 24/7 for Active Stays
              </span>
            </div>
          </div>

          <div className="p-7 rounded-[2rem] bg-white dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#27272a] shadow-editorial flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center shrink-0 border border-[#e5e0d8] dark:border-[#3f3f46]">
              <ShieldCheck className="w-5 h-5 text-[#b58d59] dark:text-[#d4b996]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-editorial text-lg font-bold text-[#18181b] dark:text-[#fbfbf9]">
                HavenStay Protection
              </h3>
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
                Guaranteed safe stays & verified host backing
              </p>
              <span className="inline-block pt-1 text-[11px] font-semibold text-[#71717a] dark:text-[#a1a1aa]">
                Full booking coverage
              </span>
            </div>
          </div>
        </div>

        {/* 3. CATEGORY SELECTOR PILLS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#e5e0d8] dark:border-[#27272a] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#71717a] dark:text-[#a1a1aa] block">
                BROWSE BY TOPIC
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-light text-[#18181b] dark:text-[#fbfbf9]">
                Help Categories
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b] shadow-sm'
                  : 'bg-[#f4f0e8] dark:bg-[#1c1c20] text-[#71717a] dark:text-[#a1a1aa] hover:bg-[#ede7dc] dark:hover:bg-[#27272a] hover:text-[#18181b] dark:hover:text-white'
              }`}
            >
              All Topics
            </button>
            {FAQ_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveCategory(sec.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategory === sec.id
                    ? 'bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b] shadow-sm'
                    : 'bg-[#f4f0e8] dark:bg-[#1c1c20] text-[#71717a] dark:text-[#a1a1aa] hover:bg-[#ede7dc] dark:hover:bg-[#27272a] hover:text-[#18181b] dark:hover:text-white'
                }`}
              >
                <sec.icon className="w-3.5 h-3.5" />
                <span>{sec.title}</span>
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-8">
            {filteredSections.length === 0 ? (
              <div className="p-12 text-center rounded-[2rem] bg-white dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#27272a] space-y-3">
                <HelpCircle className="w-8 h-8 text-[#a1a1aa] mx-auto" />
                <h3 className="font-editorial text-xl font-bold">No matching help articles found</h3>
                <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
                  Try searching for a different keyword or contact our support team below.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#18181b] text-white dark:bg-[#d4b996] dark:text-[#18181b]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredSections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white dark:bg-[#1c1c20] rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#27272a] p-6 sm:p-9 shadow-editorial space-y-6"
                >
                  <div className="flex items-center gap-3 border-b border-[#f4f0e8] dark:border-[#27272a] pb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center border border-[#e5e0d8] dark:border-[#3f3f46]">
                      <section.icon className="w-4 h-4 text-[#b58d59] dark:text-[#d4b996]" />
                    </div>
                    <div>
                      <h3 className="font-editorial text-2xl font-bold text-[#18181b] dark:text-[#fbfbf9]">
                        {section.title}
                      </h3>
                      <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {section.questions.map((item, idx) => {
                      const itemKey = `${section.id}-${idx}`;
                      const isOpen = openFaq === itemKey;

                      return (
                        <div
                          key={idx}
                          className="rounded-2xl border border-[#e5e0d8] dark:border-[#27272a] overflow-hidden transition-all duration-200"
                        >
                          <button
                            onClick={() => toggleFaq(itemKey)}
                            className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-[#fbfbf9] dark:bg-[#18181b] hover:bg-[#f4f0e8] dark:hover:bg-[#222226] transition-colors cursor-pointer"
                          >
                            <span className="font-editorial text-base sm:text-lg font-medium text-[#18181b] dark:text-[#fbfbf9] pr-4">
                              {item.q}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-[#71717a] dark:text-[#a1a1aa] shrink-0 transition-transform duration-200 ${
                                isOpen ? 'rotate-180 text-[#b58d59] dark:text-[#d4b996]' : ''
                              }`}
                            />
                          </button>

                          {isOpen && (
                            <div className="p-4 sm:p-5 bg-white dark:bg-[#141417] text-xs sm:text-sm text-[#52525b] dark:text-[#d4d4d8] leading-relaxed border-t border-[#e5e0d8] dark:border-[#27272a] animate-fadeIn">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4. CONTACT CONCIERGE & SUPPORT FORM */}
        <div id="contact-form" className="bg-white dark:bg-[#1c1c20] rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#27272a] p-8 sm:p-12 shadow-editorial">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#71717a] dark:text-[#a1a1aa] block">
                DIRECT INQUIRIES
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-light text-[#18181b] dark:text-[#fbfbf9] uppercase">
                Contact HavenStay Support
              </h2>
              <p className="text-xs sm:text-sm text-[#71717a] dark:text-[#a1a1aa] max-w-lg mx-auto">
                Have a specific question about your booking, host communication, or account? Send a message to our support desk.
              </p>
            </div>

            {/* Submission Success Banner */}
            {formSubmitted ? (
              <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 space-y-4 text-center animate-fadeIn">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-editorial text-2xl font-bold">Support Request Received</h3>
                  <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
                    Your inquiry has been assigned reference ticket{' '}
                    <strong className="font-mono underline">{ticketId}</strong>. A HavenStay concierge specialist will reply to your email within 2 hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormSubmitted(false)}
                  className="px-6 py-2.5 bg-emerald-800 text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-emerald-900 transition-all cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-5">
                {formError && (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#18181b] dark:text-[#fbfbf9]" htmlFor="contact-name">
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 bg-[#fbfbf9] dark:bg-[#141417] border border-[#e5e0d8] dark:border-[#27272a] rounded-xl text-xs sm:text-sm text-[#18181b] dark:text-[#fbfbf9] placeholder-[#a1a1aa] focus:outline-none focus:ring-1 focus:ring-[#b58d59] transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#18181b] dark:text-[#fbfbf9]" htmlFor="contact-email">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 bg-[#fbfbf9] dark:bg-[#141417] border border-[#e5e0d8] dark:border-[#27272a] rounded-xl text-xs sm:text-sm text-[#18181b] dark:text-[#fbfbf9] placeholder-[#a1a1aa] focus:outline-none focus:ring-1 focus:ring-[#b58d59] transition-all"
                    />
                  </div>
                </div>

                {/* Issue / Subject */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#18181b] dark:text-[#fbfbf9]" htmlFor="contact-subject">
                    Issue Category / Subject *
                  </label>
                  <select
                    id="contact-subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-[#fbfbf9] dark:bg-[#141417] border border-[#e5e0d8] dark:border-[#27272a] rounded-xl text-xs sm:text-sm text-[#18181b] dark:text-[#fbfbf9] focus:outline-none focus:ring-1 focus:ring-[#b58d59] transition-all cursor-pointer"
                  >
                    <option value="Booking Assistance">Booking & Reservation Inquiries</option>
                    <option value="Payment & Billing">Payment, Invoicing & Pricing</option>
                    <option value="Cancellation or Refund">Cancellation & Refund Request</option>
                    <option value="Account & Login Help">Account Credentials & Verification</option>
                    <option value="Stay / On-Site Issue">Current Stay / Property Maintenance Issue</option>
                    <option value="Host Inquiry">Host Hub & Property Listing Inquiry</option>
                    <option value="General Question">General Platform Inquiry</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#18181b] dark:text-[#fbfbf9]" htmlFor="contact-message">
                    Message Details *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Describe your issue or question in detail (include booking ID or property title if applicable)..."
                    className="w-full px-4 py-3 bg-[#fbfbf9] dark:bg-[#141417] border border-[#e5e0d8] dark:border-[#27272a] rounded-xl text-xs sm:text-sm text-[#18181b] dark:text-[#fbfbf9] placeholder-[#a1a1aa] focus:outline-none focus:ring-1 focus:ring-[#b58d59] transition-all"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-4 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] active:scale-[0.98] text-white dark:text-[#18181b] text-xs font-semibold uppercase tracking-wider rounded-full shadow-editorial transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span>Sending Request...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Support Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
