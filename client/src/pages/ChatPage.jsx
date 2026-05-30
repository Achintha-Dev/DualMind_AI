import { useEffect, useState, useRef, useCallback } from 'react'; 
import { FiCpu } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router';

import ChatInput from '../components/ChatInput';
import { askQuestion } from '../api/chatApi';
import MessageBody from '../components/MessageBody';
import { useAuth } from '../hooks/useAuth.js'
import { getConversation } from '../api/historyApi';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversationId, setConversationId] = useState(null);
 

  useEffect(() => {
    async function loadConversation() {

      const threadId = location.state?.threadId;

      if (!threadId) return;

      try {
        const data = await getConversation(threadId);

        setConversationId(data.conversation._id);

        setMessages(
          data.conversation.messages.map(
            msg => ({
              role: msg.role,
              text: msg.text,
              timestamp: ''
            })
          )
        );

      } catch (error) {
        console.error(error);
      }
    }

    loadConversation();

  }, [location.state]);
  
  const bottomRef = useRef(null);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);


  // Load Guest Messages On Refresh
  useEffect(() => {
    // only for guest users
    if (!user) {
      const savedMessages = sessionStorage.getItem('guest_messages');

      if (savedMessages) {
        const timer = setTimeout(() => {
          setMessages(JSON.parse(savedMessages));
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  useEffect(() => {
    // only save guest chats
    if (!user && messages.length > 0) {

      sessionStorage.setItem(
        'guest_messages',
        JSON.stringify(messages)
      );
    }
  }, [messages, user]);


  // Prevent restoring old chats after login.
  useEffect(() => {

    if (user) {
      sessionStorage.removeItem('guest_messages');
    }

  }, [user]);



  // Memoize handleInitialSend with useCallback so it doesn't trigger effect loops
  const handleInitialSend = useCallback(async (initialQuestion) => {
    if (!initialQuestion.trim()) return;
    
    const userMessage = {
      role: 'user',
      text: initialQuestion,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([userMessage]);
    setLoading(true);
    
    try {
      const data = await askQuestion(initialQuestion);
      
      const aiMessage = {
        role: 'assistant',
        text: data?.answer || data?.text || 'No data payload returned from system endpoint.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      
    } catch (err) {
      console.error("API error encountered during initial fetch setup:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: '⚠️ Failed to get response. Please check server endpoint connections and try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);

    } finally {
      setLoading(false);
      // Clean location stack history so page refreshes don't re-execute the request sequence
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, navigate]); 



  // Schedule the initial send to avoid sync state updates inside an effect
  useEffect(() => {

    const initialQuestion = location.state?.initialQuestion;

    if (initialQuestion) {
      const timer = setTimeout(() => {
        handleInitialSend(initialQuestion);
      }, 0);
      return () => clearTimeout(timer);
    }

  }, [location.state, handleInitialSend]);



  // Primary workspace interaction submission handler 
  async function handleSend() {
    if (!question.trim() || loading) return;

    const userMessage = {
      role: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    const activePayload = question;
    setQuestion(''); 

    try {
      const data = await askQuestion(activePayload, conversationId);

      if (
        !conversationId &&
        data.conversationId
      ) {
        setConversationId(
          data.conversationId
        );
      }

      const aiMessage = {
        role: 'assistant',
        text: data?.answer || data?.text || 'Empty response payload received.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("API submission layer error encountered:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: '⚠️ Something went wrong. Connection timed out.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden lg:h-screen bg-zinc-50 dark:bg-[#1a1a1a] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      
      {/* Top Navbar Title Metadata Block */}
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

      {/* Main Timeline Body Viewport */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-3xl w-full mx-auto scrollbar-thin">
        <MessageBody messages={messages} loading={loading} bottomRef={bottomRef}/>
      </div>

      {/* Input row console box element */}
      <div className="p-4 bg-gradient-to-t from-zinc-50 via-zinc-50 to-transparent dark:from-[#1a1a1a] dark:via-[#1a1a1a] dark:to-transparent border-t border-zinc-200/40 dark:border-zinc-900/40">
        <div className="max-w-3xl w-full mx-auto bg-white dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-3 shadow-md focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all duration-200">
          <ChatInput question={question} setQuestion={setQuestion} handleSend={handleSend} loading={loading} />
        </div>
        <p className="mt-2 text-[10px] text-center text-zinc-400 dark:text-zinc-500 tracking-normal">
          DualMind can produce inaccurate information about programming configurations.
        </p>
      </div>

    </div>
  );
}

export default ChatPage;