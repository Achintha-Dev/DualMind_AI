import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { FiArrowUp, FiPaperclip } from "react-icons/fi";
import { IoInformationCircle } from "react-icons/io5";

function ChatInput({ question, setQuestion, handleSend, loading }) {

  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";

    const nextHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${nextHeight}px`;

  }, [question]);

  const onSubmitClear = () => {
    handleSend();
    // Force field height to drop back down cleanly to initial rows after submission
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2.5">
            
            {/* Main Interactive TextArea Box */}
            <textarea
                id="chat-input"
                ref={textareaRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {if(e.key === 'Enter' && !e.shiftKey){e.preventDefault(); onSubmitClear(); }}}
                rows={2}
                placeholder="Ask anything..."
                className="w-full resize-none bg-transparent border-none text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-base sm:text-sm focus:outline-none focus:ring-0 px-2 pt-1"
            />

            {/* Form Utility Controls Action Row */}
            <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
              
              {/* Media Attachments Action Button */}
              <button
                type="button" 
                // title="Attach files or context"
                className="lg:tooltip p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors active:scale-95 cursor-pointer"
                data-tip="This feature is coming soon!"
                onClick={() => toast('This feature is coming soon!', 
                  { icon: <IoInformationCircle size={18} className="text-blue-500 scale-125" /> , position: 'bottom-center'}
                )}
              >
                <FiPaperclip size={18} />
              </button>

              {/* Submit Message Dispatcher Triggers */}
              <button 
                onClick={handleSend}
                disabled={!question.trim() || loading}
                type="submit"
                title="Send Message"
                className="p-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-white transition-all active:scale-95 shadow-md cursor-pointer"
              >
                <FiArrowUp size={18} strokeWidth={2.5} />
              </button>

            </div>
          </form>
  )
}

export default ChatInput