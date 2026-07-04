import React, { useState, useRef, useEffect } from 'react';
import { askChatbot } from '../../services/geminiService';
import { useTrip } from '../../context/TripContext';
import { useTheme } from '../../context/ThemeContext';
import { TRANSLATIONS } from '../../utils/constants';
import { MessageSquare, Send, X, Bot, User, HelpCircle } from 'lucide-react';

export const Chatbot = () => {
  const { destinationGuide } = useTrip();
  const { language } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Greetings, fellow traveler! I am Cultural Compass. Ask me any question about local traditions, dining etiquette, clothing rules, or historical stories.' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  const listRef = useRef(null);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  useEffect(() => {
    // Scroll chat list to bottom on new messages
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userMessageText = inputVal.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMessageText }]);
    setInputVal('');
    setLoading(true);

    const contextDestination = destinationGuide?.queryDestination || '';

    try {
      const data = await askChatbot(userMessageText, contextDestination);
      if (data && data.response) {
        setMessages((prev) => [...prev, { role: 'assistant', text: data.response }]);
      } else if (data && data.error) {
        setMessages((prev) => [...prev, { role: 'assistant', text: data.error }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'My apologies, I am having trouble connecting to the cultural records right now. Please try again shortly.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 p-4 bg-indigo-600 hover:bg-indigo-755 text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 animate-bounce"
          aria-label="Open Cultural Q&A chatbot"
        >
          <MessageSquare size={22} />
          <span className="text-xs font-bold hidden md:inline">Ask Culture</span>
        </button>
      )}

      {/* Floating Chat Container */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[450px] glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b bg-indigo-600 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot size={20} className="text-orange-300 shrink-0" />
              <div>
                <h3 className="text-xs font-extrabold tracking-wide uppercase">Cultural Compass AI</h3>
                {destinationGuide && (
                  <span className="text-[10px] text-indigo-200 block">Browsing: {destinationGuide.queryDestination}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-indigo-200 focus:outline-none"
              aria-label="Close Chatbot"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-900 transition-theme">
            {messages.map((msg, idx) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={idx}
                  className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} items-start gap-2.5`}
                >
                  {isAssistant && (
                    <div className="p-1 bg-indigo-100 text-indigo-600 rounded-lg shrink-0">
                      <Bot size={14} />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed font-medium ${
                      isAssistant
                        ? 'bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-205 border dark:border-slate-800'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            
            {loading && (
              <div className="flex justify-start items-center gap-2">
                <div className="p-1 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Bot size={14} />
                </div>
                <div className="flex space-x-1 p-3 bg-white dark:bg-slate-850 rounded-2xl border dark:border-slate-800">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            
            <div ref={listRef} />
          </div>

          {/* Bottom input area */}
          <form onSubmit={handleSendMessage} className="p-3 border-t bg-white dark:bg-slate-950 flex gap-2">
            <label htmlFor="chat-input" className="sr-only">Ask a cultural question</label>
            <input
              id="chat-input"
              type="text"
              required
              placeholder="e.g. Is it rude to tip in Japan?"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-750 text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow disabled:opacity-50 transition-colors shrink-0"
              aria-label="Submit question"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
