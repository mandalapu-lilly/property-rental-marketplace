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
            className="group flex items-center gap-2.5 px-5 py-3.5 bg-[#18181b] hover:bg-black dark:bg-[#1c1c20] dark:hover:bg-[#27272a] text-[#fbfbf9] rounded-full shadow-editorial-lg border border-[#b58d59]/40 hover:border-[#b58d59] transition-all duration-300 transform hover:scale-105 cursor-pointer"
            aria-label="Open AI Rental Assistant"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-[#d4b996] animate-spin-slow" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
            </div>
            <span className="font-bold text-sm tracking-wide text-[#fbfbf9]">AI Rental Assistant</span>
          </button>
        </div>
      )}

      {/* Expandable Chat Drawer Window */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-white dark:bg-[#1c1c20] rounded-3xl shadow-editorial-lg border border-[#e5e0d8] dark:border-[#27272a] flex flex-col overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'bottom-4 right-4 left-4 top-20 sm:left-auto sm:top-auto sm:w-[680px] sm:h-[720px]'
              : 'bottom-6 right-6 w-[92vw] sm:w-[440px] h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-[#18181b] dark:bg-[#121214] text-white flex items-center justify-between border-b border-[#27272a]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#27272a] border border-[#3f3f46] flex items-center justify-center text-[#d4b996] shadow-sm">
                <Bot className="w-5 h-5 text-[#d4b996]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white">AI Rental Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                </div>
                <p className="text-[11px] text-[#a1a1aa]">Natural language property finder</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear conversation"
                className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Minimize' : 'Expand'}
                className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-white/10 transition-colors hidden sm:block cursor-pointer"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#fbfbf9] dark:bg-[#141417]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-[#18181b] dark:bg-[#27272a] text-[#d4b996] border border-[#3f3f46] flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4b996]" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b] rounded-br-none'
                      : 'bg-white dark:bg-[#1c1c20] text-[#18181b] dark:text-[#f4f0e8] border border-[#e5e0d8] dark:border-[#27272a] rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line font-medium">{msg.text}</div>

                  {/* Property Cards Carousel / Stack */}
                  {msg.properties && msg.properties.length > 0 && (
                    <div className="mt-3 space-y-2.5">
                      {msg.properties.map((prop) => (
                        <div
                          key={prop._id}
                          className="bg-[#fbfbf9] dark:bg-[#27272a]/70 border border-[#e5e0d8] dark:border-[#3f3f46] rounded-xl p-2.5 hover:border-[#b58d59] dark:hover:border-[#d4b996] transition-colors flex gap-3"
                        >
                          <img
                            src={
                              prop.images && prop.images.length > 0
                                ? prop.images[0]
                                : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80'
                            }
                            alt={prop.title}
                            className="w-20 h-20 object-cover rounded-lg shrink-0 bg-[#e5e0d8] dark:bg-[#3f3f46]"
                          />
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b58d59] dark:text-[#d4b996] bg-[#f4f0e8] dark:bg-[#18181b] border border-[#ded7cb] dark:border-[#3f3f46] px-1.5 py-0.5 rounded">
                                  {prop.propertyType}
                                </span>
                                <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span>{prop.averageRating ? prop.averageRating.toFixed(1) : 'New'}</span>
                                </div>
                              </div>
                              <h4 className="font-bold text-[#18181b] dark:text-[#fbfbf9] text-xs truncate" title={prop.title}>
                                {prop.title}
                              </h4>
                              <p className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] flex items-center gap-1 truncate mt-0.5">
                                <MapPin className="w-3 h-3 text-[#8c827a] shrink-0" />
                                <span>{prop.location}, {prop.city}</span>
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-[#e8e3da] dark:border-[#3f3f46] mt-1">
                              <span className="font-extrabold text-[#18181b] dark:text-[#fbfbf9] text-xs">
                                {formatCurrency(prop.price)}
                                <span className="text-[10px] font-normal text-[#71717a] dark:text-[#a1a1aa]">/mo</span>
                              </span>
                              <Link
                                to={`/properties/${prop._id}`}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#b58d59] dark:text-[#d4b996] hover:text-[#8c6b3e] dark:hover:text-[#fbfbf9]"
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
                    <div className="mt-3 pt-2.5 border-t border-[#e8e3da] dark:border-[#27272a] flex flex-wrap gap-1.5">
                      {msg.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(suggestion)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#f4f0e8] hover:bg-[#eae3d6] dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-[#18181b] dark:text-[#fbfbf9] border border-[#ded7cb] dark:border-[#3f3f46] transition-colors cursor-pointer text-left"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-white/70 dark:text-[#18181b]/70' : 'text-[#8c827a] dark:text-[#71717a]'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-[#18181b] dark:bg-[#27272a] text-white flex items-center justify-center shrink-0 mt-1 shadow-xs border border-[#3f3f46]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-lg bg-[#18181b] dark:bg-[#27272a] text-[#d4b996] flex items-center justify-center shrink-0 shadow-xs border border-[#3f3f46]">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4b996] animate-spin" />
                </div>
                <div className="bg-white dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#27272a] rounded-2xl rounded-tl-none p-3 shadow-xs flex items-center gap-2 text-xs text-[#71717a] dark:text-[#a1a1aa]">
                  <Loader2 className="w-4 h-4 animate-spin text-[#b58d59] dark:text-[#d4b996]" />
                  <span>Searching properties with AI NLP engine...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3.5 bg-white dark:bg-[#18181b] border-t border-[#e8e3da] dark:border-[#27272a]">
            <div className="flex items-center gap-2 bg-[#fbfbf9] dark:bg-[#141417] rounded-2xl border border-[#ded7cb] dark:border-[#3f3f46] px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#b58d59] dark:focus-within:ring-[#d4b996] focus-within:border-transparent transition-all">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask e.g. 2BHK in Guntur under 25k with parking..."
                disabled={loading}
                className="flex-1 bg-transparent text-xs sm:text-sm text-[#18181b] dark:text-[#fbfbf9] placeholder-[#8c827a] dark:placeholder-[#71717a] focus:outline-none py-1"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || loading}
                className="p-2 rounded-xl bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] dark:text-[#18181b] disabled:opacity-40 text-white shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-[#8c827a] dark:text-[#71717a] mt-1.5">
              Natural language rental matching powered by HavenStay AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}
