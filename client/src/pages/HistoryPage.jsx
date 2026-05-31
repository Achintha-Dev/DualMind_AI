import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getHistory, deleteConversation } from '../api/historyApi';
import { toast } from 'react-hot-toast';
import { FiClock, FiEdit2, FiMessageSquare, FiSearch, FiTrash2 } from 'react-icons/fi';

function HistoryPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Group conversations into Today / Yesterday / Older
  const groupHistory = (history = []) => {
    const groups = { Today: [], Yesterday: [], Older: [] };
    const now = new Date();

    history.forEach((item) => {
      const created = new Date(item.createdAt);
      const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));

      const formatted = {
        id:       item._id,
        title:    item.title,
        preview:  item.title,
        time:     created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        // messages array has alternating user/assistant pairs
        messages: item.messages?.length ?? 0,
        tokens:   item.tokensUsed || 0,
      };

      if (diffDays === 0)      groups.Today.push(formatted);
      else if (diffDays === 1) groups.Yesterday.push(formatted);
      else                     groups.Older.push(formatted);
    });

    return ['Today', 'Yesterday', 'Older']
      .filter(period => groups[period].length > 0)
      .map(period => ({ period, items: groups[period] }));
  };

  // Derive filtered groups from current state on every render — no stale closure
  const historyGroups = groupHistory(conversations);
  const filteredGroups = historyGroups.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(group => group.items.length > 0);

  const totalCount = conversations.length;

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getHistory();
        setConversations(data.conversations || []);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.error || 'Failed to load history.');
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();

    try {
      await deleteConversation(id);
      setConversations(prev => prev.filter(c => c._id !== id));
      toast.success('Conversation deleted.');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Failed to delete conversation.');
    }
  };

  const handleItemClick = (id) => {
    navigate('/chat', { state: { threadId: id } });
  };

  const noResults = !loading && filteredGroups.length === 0;

  return (
    <div className="flex flex-col flex-1 h-full w-full lg:pl-16 bg-zinc-50 dark:bg-[#1a1a1a] text-zinc-900 dark:text-zinc-100 transition-colors duration-300 overflow-y-auto">

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:p-12 flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-6 shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Workspace History</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Review, manage, and continue your pipeline threads.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-zinc-200/60 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-300/20">
              Total Threads: {totalCount}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 w-full shrink-0">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/5 transition-all duration-200"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 space-y-8 mt-2">
          {loading && (
            <div className="p-8 text-sm text-zinc-400 dark:text-zinc-600">Loading history…</div>
          )}

          {filteredGroups.map((group) => (
            <div key={group.period} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-2 pl-1">
                <FiClock size={12} />
                {group.period}
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className="group relative flex items-center justify-between p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/20 hover:bg-zinc-100 dark:hover:bg-zinc-800/30 hover:border-zinc-300 dark:hover:border-zinc-700/60 transition-all duration-200 cursor-pointer shadow-sm shadow-zinc-100/50 dark:shadow-none"
                  >
                    <div className="flex items-start gap-4 min-w-0 pr-12">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/5 dark:text-blue-400 flex items-center justify-center border border-blue-500/10 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <FiMessageSquare size={18} />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h4 className="text-sm font-semibold tracking-tight text-zinc-800 dark:text-zinc-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate leading-relaxed">
                          {item.preview}
                        </p>
                        <div className="flex items-center gap-3 pt-1 text-[11px] font-medium text-zinc-400 dark:text-zinc-600">
                          <span>{item.messages} messages</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-800" />
                          <span>{item.tokens} tokens</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 group-hover:opacity-0 transition-opacity">
                        {item.time}
                      </span>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-zinc-100 via-zinc-100 pl-4 dark:from-[#1a1a1a] dark:via-[#1a1a1a] h-full rounded-r-xl">
                        <button
                          title="Rename (coming soon)"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all cursor-pointer active:scale-95"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          title="Delete conversation"
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer active:scale-95"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Empty state */}
          {noResults && (
            <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-100/20 dark:bg-zinc-900/10">
              <p className="text-sm text-zinc-400 dark:text-zinc-600 font-medium">
                {searchQuery
                  ? 'No conversations matched your search.'
                  : 'No conversation history yet. Start a new chat!'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default HistoryPage;