import { useState } from "react";
import { FiCpu, FiCopy, FiCheck } from "react-icons/fi"; // Added copy icons
import ChatMarkdown from "./ChatMarkdown";
import Loading from "./Loading";

function MessageBody({ messages, loading, bottomRef }) {
  // State tracking to change icon into a checkmark momentarily per bubble index
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // Reset icon after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div>
        {messages.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
            <FiCpu size={32} className="mb-3 text-zinc-400" />
            <p className="text-sm font-medium">Thread initialized. Send a message to start processing.</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 sm:gap-4 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm text-xs font-semibold shrink-0">
                AI
              </div>
            )}

            <div className={`flex flex-col max-w-[88%] sm:max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} group/bubble`}>
              <div className={`relative px-4 py-3 rounded-2xl text-base sm:text-sm shadow-sm leading-relaxed w-full overflow-hidden
                ${msg.role === 'user' 
                  ? 'bg-zinc-900/10 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 rounded-tr-none' 
                  : 'bg-white dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 rounded-tl-none'
                }`}
              >
                {/* Copy Action Button Element - Positioned absolutely at the top right of the bubble */}
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.text, idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-500 dark:text-zinc-400 opacity-0 group-hover/bubble:opacity-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-800 dark:hover:text-zinc-200 transition-all duration-200 z-10"
                    title="Copy response"
                  >
                    {copiedIndex === idx ? (
                      <FiCheck size={14} className="text-green-600 dark:text-emerald-400" />
                    ) : (
                      <FiCopy size={14} />
                    )}
                  </button>
                )}

                <div className={msg.role === 'assistant' ? 'pr-6' : ''}>
                  <ChatMarkdown msg={{ text: msg.text || '' }} />
                </div>
              </div>
              
              <span className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-1.5 px-1 font-medium">
                {msg.timestamp || 'Just now'}
              </span>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm text-xs font-semibold shrink-0">
                U
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="w-full flex justify-start pl-12">
            <Loading />
          </div>
        )}
        <div ref={bottomRef} />
    </div>
  );
}

export default MessageBody;