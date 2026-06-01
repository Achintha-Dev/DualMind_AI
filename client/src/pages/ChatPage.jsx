import { useEffect, useState, useRef, useCallback } from 'react';
import { FiCpu } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router';

import ChatInput from '../components/ChatInput';
import { generateImage } from '../api/imageApi.js';
import { askQuestion } from '../api/chatApi';
import MessageBody from '../components/MessageBody';
import { useAuth } from '../hooks/useAuth.js';
import { getConversation } from '../api/historyApi';
import { toast } from 'react-hot-toast';

function isImageRequest(text) {
  const lower = text.toLowerCase();
  const imageWords = ['image', 'picture', 'photo', 'illustration', 'art', 'poster', 'logo', 'drawing', 'painting'];
  const actionWords = ['generate', 'create', 'draw', 'make', 'show', 'paint', 'design', 'produce'];
  return imageWords.some(w => lower.includes(w)) && actionWords.some(w => lower.includes(w));
}

function ChatPage() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('guest_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const bottomRef = useRef(null);

  // Load an existing conversation when navigating from History
  useEffect(() => {
    async function loadConversation() {
      const threadId = location.state?.threadId;
      if (!threadId) return;

      try {
        const data = await getConversation(threadId);
        setConversationId(data.conversation._id);
        setMessages(
          data.conversation.messages.map(msg => ({
            role: msg.role,
            text: msg.text,
            timestamp: '',
          }))
        );
      } catch (error) {
        console.error('Failed to load conversation:', error);
      }
    }

    loadConversation();
  }, [location.state?.threadId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Persist guest messages to sessionStorage
  useEffect(() => {
    if (!user && messages.length > 0) {
      sessionStorage.setItem('guest_messages', JSON.stringify(messages));
    }
  }, [messages, user]);

  // Clear guest messages when user logs in
  useEffect(() => {
    if (user) {
      sessionStorage.removeItem('guest_messages');
    }
  }, [user]);

  // Handle the initial question passed from the HomePage
  const handleInitialSend = useCallback(async (initialQuestion) => {
    if (!initialQuestion.trim()) return;

    const trimmed = initialQuestion.trim();

    const userMessage = {
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([userMessage]);
    setLoading(true);

    try {
      if (isImageRequest(trimmed)) {
        const imageUrl = generateImage(trimmed);
        setMessages(prev => [...prev, {
          role: 'assistant',
          type: 'image',
          imageUrl,
          text: `Generated: "${trimmed}"`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
        return;
      }

      const data = await askQuestion(trimmed, null);

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        text: data?.answer || data?.text || 'No response received from the server.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);

    } catch (err) {
      console.error('Initial send error:', err);
      const errMsg = err.response?.data?.error || 'Something went wrong. Please try again.';
      toast.error(errMsg);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `⚠️ ${errMsg}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);

    } finally {
      setLoading(false);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, navigate]);

  // Trigger initial send when navigating from HomePage with a pre-filled question
  useEffect(() => {
    const initialQuestion = location.state?.initialQuestion;
    if (!initialQuestion) return;

    const timer = setTimeout(() => {
      handleInitialSend(initialQuestion);
    }, 0);

    return () => clearTimeout(timer);
  }, [location.state?.initialQuestion, handleInitialSend]);

  // Handle follow-up messages in an active conversation
  async function handleSend() {
    if (!question.trim() || loading) return;

    const trimmed = question.trim();

    const userMessage = {
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      if (isImageRequest(trimmed)) {
        const imageUrl = generateImage(trimmed);
        setMessages(prev => [...prev, {
          role: 'assistant',
          type: 'image',
          imageUrl,
          text: `Generated: "${trimmed}"`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
        return;
      }

      const data = await askQuestion(trimmed, conversationId);

      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        text: data?.answer || 'Empty response received.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);

    } catch (err) {
      console.error('Send error:', err);
      const errMsg = err.response?.data?.error || 'Something went wrong. Please try again.';
      toast.error(errMsg);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `⚠️ ${errMsg}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden lg:h-screen bg-zinc-50 dark:bg-[#1a1a1a] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">

      {/* Top Navbar */}
      <div className="px-6 py-3.5 border-b border-zinc-200/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/20 backdrop-blur-md md:flex hidden items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
            <FiCpu size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">Active Pipeline Workspace</h3>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">DualMind 4.0 Architecture</p>
          </div>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-3xl w-full mx-auto scrollbar-thin">
        <MessageBody messages={messages} loading={loading} bottomRef={bottomRef} />
      </div>

      {/* Input area */}
      <div className="p-4 bg-gradient-to-t from-zinc-50 via-zinc-50 to-transparent dark:from-[#1a1a1a] dark:via-[#1a1a1a] dark:to-transparent border-t border-zinc-200/40 dark:border-zinc-900/40">
        <div className="max-w-3xl w-full mx-auto bg-white dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-3 shadow-md focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all duration-200">
          <ChatInput question={question} setQuestion={setQuestion} handleSend={handleSend} loading={loading} />
        </div>
        <p className="mt-2 text-[10px] text-center text-zinc-400 dark:text-zinc-500 tracking-normal">
          DualMind can produce inaccurate information. Always verify important facts.
        </p>
      </div>
    </div>
  );
}

export default ChatPage;