import { FiCompass, FiCode, FiEdit3, FiCpu } from 'react-icons/fi';
import ChatInput from '../components/ChatInput';
import { useState } from 'react';
import { useNavigate } from 'react-router';

function HomePage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false); // Turned off by default
  const navigate = useNavigate();

  const handleSend = (forcedQuestion) => {
    const activeText = forcedQuestion || question;
    if (!activeText.trim()) return;
    
    setLoading(true);
    navigate('/chat', {
      state: {
        initialQuestion: activeText
      }
    });
    setQuestion('');
  };

  // Cleanly forwards suggestions right into the routing flow
  const handleSuggestionClick = (promptText) => {
    handleSend(promptText);
  };

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-[#1a1a1a] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <main className="flex-1 flex flex-col items-center justify-between px-4 py-8 md:p-12 max-w-4xl w-full mx-auto">
        
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 my-auto">
          <div className="p-3 bg-blue-500/10 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-500/20 shadow-sm">
            <FiCpu size={32} className="animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100">
            Where should your mind go next?
          </h2>
          <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-md">
            DualMind AI coordinates parallel LLM processing pipelines seamlessly to supercharge your research, coding, and writing.
          </p>
        </div>

        {/* Suggestion Blocks */}
        <div className="w-full md:grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8 hidden">
          <div 
            onClick={() => handleSuggestionClick("Design a database schema for an e-commerce platform")}
            className="group flex flex-col justify-between p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-sm"
          >
            <div className="flex items-start justify-between">
              <span className="text-zinc-700 dark:text-zinc-300 text-sm font-medium pr-4">
                Design a database schema for an e-commerce platform
              </span>
              <FiCode className="text-zinc-400 group-hover:text-blue-500 transition-colors shrink-0 mt-0.5" />
            </div>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-3">Software Architecture</span>
          </div>

          <div 
            onClick={() => handleSuggestionClick("Draft a professional email explaining a technical launch delay")}
            className="group flex flex-col justify-between p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-sm"
          >
            <div className="flex items-start justify-between">
              <span className="text-zinc-700 dark:text-zinc-300 text-sm font-medium pr-4">
                Draft a professional email explaining a technical launch delay
              </span>
              <FiEdit3 className="text-zinc-400 group-hover:text-teal-500 transition-colors shrink-0 mt-0.5" />
            </div>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-3">Professional Writing</span>
          </div>

          <div 
            onClick={() => handleSuggestionClick("Compare SQL vs NoSQL databases for a high-traffic analytics app")}
            className="group flex flex-col justify-between p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-sm"
          >
            <div className="flex items-start justify-between">
              <span className="text-zinc-700 dark:text-zinc-300 text-sm font-medium pr-4">
                Compare SQL vs NoSQL databases for high-traffic analytics
              </span>
              <FiCompass className="text-zinc-400 group-hover:text-purple-500 transition-colors shrink-0 mt-0.5" />
            </div>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-3">System Design</span>
          </div>

          <div 
            onClick={() => handleSuggestionClick("Explain quantum computing concepts to an absolute beginner")}
            className="group flex flex-col justify-between p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-sm"
          >
            <div className="flex items-start justify-between">
              <span className="text-zinc-700 dark:text-zinc-300 text-sm font-medium pr-4">
                Explain quantum computing concepts to an absolute beginner
              </span>
              <FiCpu className="text-zinc-400 group-hover:text-amber-500 transition-colors shrink-0 mt-0.5" />
            </div>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-3">Concept Breakdown</span>
          </div>
        </div>

        {/* Bottom Input Area */}
        <div className="w-full bg-white dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-3 shadow-md focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all duration-200">
          <ChatInput question={question} setQuestion={setQuestion} handleSend={() => handleSend()} loading={loading}/>
        </div>

        <p className="mt-3 text-[11px] text-center text-zinc-400 dark:text-zinc-500 tracking-normal px-6">
          DualMind AI can make mistakes. Verify critical source information.
        </p>
      </main>
    </div>
  );
}

export default HomePage;