import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  MapPin,
  Bed,
  Star,
  ArrowRight,
  Loader2,
  Trash2,
  Building,
  CheckCircle2,
  Maximize2,
  Minimize2
} from 'lucide-react';

export default function AiRentalAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am your **AI Rental Assistant**. Tell me what kind of place you are looking for, such as:\n\n• *"I need a 2BHK in Guntur under 25000"*\n• *"Show me beachfront villas in Goa with swimming pool"*\n• *"Find studios in Hyderabad under 20k"*\n• *"Which properties have the highest ratings?"*',
      properties: [],
      suggestions: [
        '2BHK in Guntur under 25000',
        'Villas with pool in Goa',
        'Studios in Hyderabad',
        'Highest rated properties',
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsgId = Date.now().toString();
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.post('/api/assistant/chat', { message: text });

      if (res.data && res.data.success) {
        const aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: res.data.reply || "Here are the best matching properties I found for your query:",
          properties: res.data.properties || [],
          filtersExtracted: res.data.filtersExtracted || {},
          suggestions: res.data.suggestions || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Unsuccessful AI response');
      }
    } catch (err) {
      console.warn('AI Assistant error:', err.message);
      const fallbackMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I experienced a brief connection hiccup, but here are some popular recommendations from our marketplace:",
        properties: [],
        suggestions: ['Explore all properties', 'Show villas in Guntur', 'Highest rated stays'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: 'Chat cleared! What property can I help you find next?',
        properties: [],
        suggestions: [
          '2BHK in Guntur under 25000',
          'Villas with pool in Goa',
          'Studios in Hyderabad',
          'Top rated properties across India',
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      {/* Floating Launcher Trigger */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle">
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-700 hover:to-violet-800 text-white rounded-full shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/70 border border-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            aria-label="Open AI Rental Assistant"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
            </div>
            <span className="font-bold text-sm tracking-wide">AI Rental Assistant</span>
          </button>
        </div>
      )}

      {/* Expandable Chat Drawer Window */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'bottom-4 right-4 left-4 top-20 sm:left-auto sm:top-auto sm:w-[680px] sm:h-[720px]'
              : 'bottom-6 right-6 w-[92vw] sm:w-[440px] h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/40">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white">AI Rental Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                </div>
                <p className="text-[11px] text-indigo-200">Natural language property finder</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Minimize' : 'Expand'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors hidden sm:block cursor-pointer"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/70">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line font-medium">{msg.text}</div>

                  {/* Property Cards Carousel / Stack */}
                  {msg.properties && msg.properties.length > 0 && (
                    <div className="mt-3 space-y-2.5">
                      {msg.properties.map((prop) => (
                        <div
                          key={prop._id}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 hover:border-indigo-300 transition-colors flex gap-3"
                        >
                          <img
                            src={
                              prop.images && prop.images.length > 0
                                ? prop.images[0]
                                : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80'
                            }
                            alt={prop.title}
                            className="w-20 h-20 object-cover rounded-lg shrink-0 bg-slate-200"
                          />
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/80 px-1.5 py-0.5 rounded">
                                  {prop.propertyType}
                                </span>
                                <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span>{prop.averageRating ? prop.averageRating.toFixed(1) : 'New'}</span>
                                </div>
                              </div>
                              <h4 className="font-bold text-slate-900 text-xs truncate" title={prop.title}>
                                {prop.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate mt-0.5">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{prop.location}, {prop.city}</span>
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 mt-1">
                              <span className="font-extrabold text-slate-900 text-xs">
                                {formatCurrency(prop.price)}
                                <span className="text-[10px] font-normal text-slate-500">/mo</span>
                              </span>
                              <Link
                                to={`/properties/${prop._id}`}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                              >
                                <span>Details</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(suggestion)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 transition-colors cursor-pointer text-left"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-2 text-xs text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>Searching properties with AI NLP engine...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3.5 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2 bg-slate-50 rounded-2xl border border-slate-300 px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask e.g. 2BHK in Guntur under 25k with parking..."
                disabled={loading}
                className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none py-1"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || loading}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-sm shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-1.5">
              Natural language rental matching powered by HavenStay AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}
