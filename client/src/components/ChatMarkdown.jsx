import { useState } from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { FiCopy, FiCheck } from 'react-icons/fi';

function useDarkMode() {
  if (typeof window !== 'undefined') {
    return document.documentElement.classList.contains('dark');
  }
  return true; 
}

function ChatMarkdown({ msg }) {
  const isDark = useDarkMode();
  const markdownText = msg?.text || '';

  // Separate localized state managers for inline layout actions
  const [copiedTableId, setCopiedTableId] = useState(null);
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  // Helper utility to turn table text elements into structured copy data
  const extractTableText = (children) => {
    let outputText = '';
    const findText = (node) => {
      if (!node) return;
      if (typeof node === 'string' || typeof node === 'number') {
        outputText += node;
      } else if (Array.isArray(node)) {
        node.forEach(findText);
      } else if (node.props && node.props.children) {
        findText(node.props.children);
        // Append spaces or row lines depending on structured node elements
        if (node.type === 'tr') outputText += '\n';
        if (node.type === 'td' || node.type === 'th') outputText += '\t';
      }
    };
    findText(children);
    return outputText.trim();
  };

  const handleInlineCopy = async (text, id, setTrigger) => {
    try {
      await navigator.clipboard.writeText(text);
      setTrigger(id);
      setTimeout(() => setTrigger(null), 2000);
    } catch (err) {
      console.error("Failed to copy data element:", err);
    }
  };

  return (
    <div className="text-zinc-800 dark:text-zinc-200 transition-colors duration-200 break-words w-full">
      <Markdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-zinc-900 dark:text-white" {...props}>{children}</h1>,
          h2: ({ children, ...props }) => <h2 className="text-xl font-semibold mt-5 mb-3 text-zinc-800 dark:text-zinc-100" {...props}>{children}</h2>,
          h3: ({ children, ...props }) => <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 mt-4 mb-2 block" {...props}>{children}</h3>,
          strong: ({ children, ...props }) => <strong className="font-bold text-blue-600 dark:text-sky-400" {...props}>{children}</strong>,
          ul: ({ children, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1 text-zinc-700 dark:text-zinc-300" {...props}>{children}</ul>,
          ol: ({ children, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1 text-zinc-700 dark:text-zinc-300" {...props}>{children}</ol>,
          li: ({ children, ...props }) => <li className="text-zinc-700 dark:text-zinc-300" {...props}>{children}</li>,
          a: ({ children, ...props }) => <a className="text-blue-600 dark:text-sky-400 hover:underline break-all" target="_blank" rel="noreferrer" {...props}>{children}</a>,
          p: ({ children, ...props }) => <p className="mb-3 leading-7 text-zinc-700 dark:text-zinc-300" {...props}>{children}</p>,
          hr: () => <hr className="border-zinc-200 dark:border-zinc-800 my-5" />,
          
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-blue-500 dark:border-sky-400/60 bg-zinc-100/80 dark:bg-zinc-800/40 backdrop-blur px-4 py-2.5 italic text-zinc-600 dark:text-zinc-300 my-4 rounded-r" {...props}>
              {children}
            </blockquote>
          ),

          // Copy Option Attached on Structured Tables
          table: ({ children, ...props }) => {
            const uniqueTableId = JSON.stringify(children).slice(0, 40);
            return (
              <div className="relative group/table w-full overflow-x-auto my-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900/10">
                <button
                  onClick={() => handleInlineCopy(extractTableText(children), uniqueTableId, setCopiedTableId)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg border border-zinc-200/60 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 opacity-0 group-hover/table:opacity-100 hover:text-zinc-800 dark:hover:text-zinc-200 shadow-sm transition-all duration-200 z-10 cursor-pointer"
                  title="Copy table content"
                >
                  {copiedTableId === uniqueTableId ? <FiCheck size={14} className="text-emerald-500" /> : <FiCopy size={14} />}
                </button>
                <table className="w-full border-collapse text-sm text-left" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          thead: ({ children, ...props }) => <thead className="bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800" {...props}>{children}</thead>,
          th: ({ children, ...props }) => <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100" {...props}>{children}</th>,
          td: ({ children, ...props }) => <td className="border-b border-zinc-100 dark:border-zinc-800/60 px-4 py-3 text-zinc-700 dark:text-zinc-300" {...props}>{children}</td>,

          // Integrated Dev-Console Header Layout for Code Snippets
          code: ({ inline, className, children, ...props }) => {
            const contentString = Array.isArray(children) ? children.join('') : String(children || '');
            const isInline = inline || (!contentString.includes('\n') && contentString.length < 60);
            const match = /language-(\w+)/.exec(className || '');
            const currentLanguage = match?.[1] || 'text';

            if (!isInline) {
              const uniqueCodeId = contentString.slice(0, 40);
              return (
                <div className="relative my-4 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-950 text-zinc-200 shadow-sm w-full font-mono text-xs">
                  
                  {/* Top Bar Label Panel Controls */}
                  <div className="flex items-center justify-between px-4 py-2 bg-zinc-100 dark:bg-[#111111] border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-sans text-[11px] font-medium tracking-wide">
                    <span className="uppercase text-[10px] font-bold tracking-wider">{currentLanguage}</span>
                    
                    <button 
                      onClick={() => handleInlineCopy(contentString, uniqueCodeId, setCopiedCodeId)}
                      className="flex items-center gap-1.5 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                    >
                      {copiedCodeId === uniqueCodeId ? (
                        <>
                          <FiCheck className="text-emerald-500" />
                          <span className="text-emerald-500 font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <FiCopy />
                          <span>Copy code</span>
                        </>
                      )}
                    </button>

                  </div>

                  <SyntaxHighlighter
                    style={isDark ? oneDark : oneLight}
                    language={currentLanguage}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: '0px',
                      padding: '1rem',
                      fontSize: '13px',
                      overflowX: 'auto',
                      backgroundColor: isDark ? '#141414' : '#fafafa',
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    }}
                  >
                    {contentString.replace(/\n$/, '')}
                  </SyntaxHighlighter>

                </div>
              );
            }

            return (
              <code
                className="bg-zinc-100 text-red-600 dark:bg-zinc-800/80 dark:text-emerald-300 border border-zinc-200 dark:border-zinc-700/50 px-1.5 py-0.5 rounded-md font-mono mx-0.5 text-[13px] break-all"
                {...props}
              >
                {contentString}
              </code>
            );
          }
        }}
      >
        {markdownText}
      </Markdown>
    </div>
  );
}

export default ChatMarkdown;