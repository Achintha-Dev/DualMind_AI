import { useNavigate } from 'react-router';
import { FiAlertTriangle, FiHome, FiArrowLeft } from 'react-icons/fi';

function NotFound() {
  const navigate = useNavigate();

  return (
    /* ✅ Aligns perfectly relative to the desktop navigation sidebar drawer */
    <div className="flex flex-col flex-1 items-center justify-center min-h-full w-full lg:pl-16 px-6 py-12 bg-zinc-50 dark:bg-[#1a1a1a] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Animated Icon Frame */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
          <FiAlertTriangle size={40} />
        </div>

        {/* Text Error Content */}
        <div className="space-y-2">
          <h1 className="text-6xl font-black tracking-tighter text-zinc-400 dark:text-zinc-600">404</h1>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Page Not Found</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
            The workspace link or pipeline node you are trying to access does not exist or has been moved.
          </p>
        </div>

        {/* Interactive Action Redirect Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-medium transition-all active:scale-95 cursor-pointer"
          >
            <FiArrowLeft size={16} />
            Go Back
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 text-sm font-medium transition-all active:scale-95 shadow-md shadow-blue-500/10 cursor-pointer"
          >
            <FiHome size={16} />
            Return Home
          </button>
        </div>

      </div>

    </div>
  );
}

export default NotFound;