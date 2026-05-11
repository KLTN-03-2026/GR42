import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, X, Send, Trash2, User, Sparkles, Maximize2, Minimize2, Mic
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../constants/config';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  _id?: number;
}

const SUGGESTED_PROMPTS = [
  "Tin tức nổi bật hôm nay là gì?",
  "Cập nhật tin công nghệ mới nhất",
  "Ai là chủ tịch nước Việt Nam?"
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [articleContext, setArticleContext] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('ai_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai_chat_history', JSON.stringify(messages));
    } else {
      localStorage.removeItem('ai_chat_history');
    }
  }, [messages]);

  useEffect(() => {
    const handleOpenWithContext = (e: any) => {
      setIsOpen(true);
      if (e.detail?.summary) {
        const contextStr = `Tiêu đề: ${e.detail.title}\nTóm tắt: ${e.detail.summary}`;
        setArticleContext(contextStr);
        setMessages(prev => [
          ...prev,
          {
            role: 'bot',
            content: `Tôi đã nhận được thông tin tóm tắt của bài báo "${e.detail.title}". Bạn muốn hỏi thêm chi tiết gì về bài báo này?`,
            timestamp: new Date()
          }
        ]);
      }
    };
    window.addEventListener('openChatbotWithContext', handleOpenWithContext);
    return () => window.removeEventListener('openChatbotWithContext', handleOpenWithContext);
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (customPrompt?: string) => {
    const promptText = typeof customPrompt === 'string' ? customPrompt : input;
    if (!promptText.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: promptText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const apiHistory = messages.map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        content: m.content
      }));

      const response = await fetch(`${API_BASE_URL}/index.php?module=api&action=news_chat_ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          articleContext: articleContext,
          history: apiHistory
        })
      });

      if (!response.ok) {
        throw new Error("HTTP Error " + response.status);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi kết nối API");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      let botContent = '';
      const botMessageId = Date.now();

      setMessages(prev => [...prev, {
        role: 'bot',
        content: '',
        timestamp: new Date(),
        _id: botMessageId
      }]);
      setLoading(false);

      let buffer = '';
      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        buffer = buffer.replace(/\r\n/g, '\n');
        let boundary = buffer.indexOf('\n\n');

        while (boundary !== -1) {
          const block = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);
          boundary = buffer.indexOf('\n\n');

          const lines = block.split('\n');
          let textAddedInBlock = '';
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.substring(6).trim();
              if (dataStr) {
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.candidates && parsed.candidates[0].content.parts) {
                    textAddedInBlock += parsed.candidates[0].content.parts.map((p: any) => p.text).join('');
                  }
                } catch (e) {
                }
              }
            }
          }
          if (textAddedInBlock) {
            botContent += textAddedInBlock;
            const newContent = botContent;
            setMessages(prev => prev.map(m =>
              m._id === botMessageId ? { ...m, content: newContent } : m
            ));
          }
        }
      }
    } catch (error: any) {
      console.error('Error in AI Chat:', error);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: error.message || 'Lỗi kết nối API. Vui lòng thử lại sau.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setArticleContext(null);
    localStorage.removeItem('ai_chat_history');
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.", 'error');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev + ' ' + transcript).trim());
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`bg-white/95 backdrop-blur-3xl rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-white/40 flex flex-col overflow-hidden mb-6 ${isExpanded ? 'w-[400px] h-[580px]' : 'w-[320px] h-[480px]'
              }`}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 border-b border-indigo-500/30 flex items-center justify-between shadow-md relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm leading-none tracking-tight">Trợ lý AI</h4>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Sẵn sàng</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-blue-100 hover:text-white hover:bg-white/20 rounded-xl transition-all">
                  {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button onClick={clearChat} className="p-2 text-blue-100 hover:text-white hover:bg-white/20 rounded-xl transition-all" title="Xóa lịch sử">
                  <Trash2 size={18} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 text-blue-100 hover:text-white hover:bg-white/20 rounded-xl transition-all ml-1">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30 space-y-4 scrollbar-hide no-scrollbar relative">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl flex items-center justify-center text-blue-600 mb-4 border border-blue-100/50 shadow-sm animate-bounce">
                    <Sparkles size={32} />
                  </div>
                  <h5 className="font-extrabold text-slate-800 mb-2">Xin chào! Bạn cần giúp gì?</h5>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-[200px] mb-6">
                    Đặt câu hỏi về các tin tức mới nhất hoặc yêu cầu tóm tắt thông tin cho bạn!
                  </p>

                  <div className="flex flex-col gap-2 w-full">
                    {SUGGESTED_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(prompt)}
                        className="text-left w-full px-4 py-3 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 text-slate-600 hover:text-blue-700 text-sm transition-all group flex items-center justify-between"
                      >
                        <span>{prompt}</span>
                        <Send size={14} className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all text-blue-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  layout
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] flex items-end gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center shadow-sm ${msg.role === 'user'
                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
                      : 'bg-gradient-to-tr from-blue-600 to-indigo-500 text-white'
                      }`}>
                      {msg.role === 'user' ? <User size={14} strokeWidth={2.5} /> : <Sparkles size={14} />}
                    </div>

                    <div className="flex flex-col gap-1 relative group">
                      <div className={`p-4 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${msg.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm shadow-blue-500/20'
                        : 'bg-white text-slate-700 border border-slate-100 rounded-bl-sm [&>p]:m-0 [&>p]:mb-1.5 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:ml-5 [&>ul]:my-1.5 [&>ol]:list-decimal [&>ol]:ml-5 [&>ol]:my-1.5 [&_a]:text-blue-600 [&_a]:font-semibold hover:[&_a]:text-blue-700 [&_strong]:text-indigo-900 max-w-full shadow-slate-200/50'
                        }`}>
                        {msg.role === 'user' ? (
                          msg.content
                        ) : (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              a: ({ node, href, children, ...props }:any) => {
                                if (href && href.startsWith('/')) {
                                  return <Link to={href} className="text-blue-600 hover:underline font-medium" {...props}>{children}</Link>;
                                }
                                return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium" {...props}>{children}</a>;
                              }
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        )}
                      </div>
                      <div className={`text-[10px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 ${msg.role === 'user' ? 'right-1' : 'left-1'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="flex items-end gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-sm flex items-center justify-center">
                      <Sparkles size={14} />
                    </div>
                    <div className="px-5 py-4 bg-white border border-slate-100 text-slate-500 text-sm rounded-3xl rounded-bl-sm flex items-center gap-2 shadow-sm shadow-slate-200/50">
                      <span className="flex gap-1">
                        <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full"></motion.span>
                        <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></motion.span>
                        <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-violet-500 rounded-full"></motion.span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} className="h-4" />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white/60 backdrop-blur-xl border-t border-slate-100/50 relative z-10">
              <div className="relative flex items-end gap-2 bg-white rounded-3xl border border-slate-200 p-1.5 shadow-sm focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-300 transition-all">
                <button
                  onClick={startListening}
                  className={`p-2.5 rounded-full transition-all shrink-0 ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  title="Nhập bằng giọng nói"
                >
                  <Mic size={18} />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Hỏi AI về tin tức..."
                  className="flex-1 max-h-[100px] min-h-[24px] bg-transparent border-none px-2 py-2.5 text-sm focus:outline-none resize-none overflow-y-auto"
                  rows={1}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className={`p-2.5 rounded-full transition-all shrink-0 ${input.trim() && !loading
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                    : 'bg-slate-100 text-slate-400'
                    }`}
                >
                  <Send size={16} className={input.trim() && !loading ? "translate-x-0.5" : ""} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-14 h-14 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center text-white transition-all duration-300 transform ${isOpen
          ? 'bg-slate-800 rotate-90 scale-90'
          : 'bg-gradient-to-tr from-blue-600 to-indigo-500 hover:shadow-[0_8px_30px_rgba(79,70,229,0.4)]'
          }`}
      >
        {isOpen ? <X size={28} /> : (
          <>
            <MessageSquare size={28} />
            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
          </>
        )}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
        )}
      </motion.button>
    </div>
  );
};

export default Chatbot;
