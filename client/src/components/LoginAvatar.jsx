import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import { LuLogOut } from 'react-icons/lu';
import { toast } from 'react-hot-toast';

function LoginAvatar({ isMobileExpanded }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    toast.success('Logged out successfully.');
    navigate('/');
  }

  const initial = user?.name?.trim().charAt(0).toUpperCase() || '';

  return (
    <div className={`flex items-center gap-3 group text-teal-600 dark:text-teal-400 hover:opacity-80 transition-opacity w-full ${isMobileExpanded ? 'px-2' : 'justify-center flex-col'}`}>

      <NavLink
        to={user ? '#' : '/login'}
        onClick={user ? (e) => e.preventDefault() : undefined}
        className={`hover:dark:bg-slate-300/10 hover:bg-slate-200 rounded-lg p-2 
          flex items-center gap-3 
          ${isMobileExpanded ? 'justify-start w-48' : 'justify-center flex-col'}
        `}
      >
        <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center shrink-0 font-semibold">
          {user ? (
            initial || (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>

        {isMobileExpanded ? (
          <div className="text-right inline-block">
            <p className="text-sm font-bold leading-tight text-zinc-800 dark:text-zinc-200">
              {user ? user.name : 'Account'}
            </p>
            <p className="text-[11px] text-zinc-400">{!user ? 'Login' : ''}</p>
          </div>
        ) : (
          <span className="text-[10px] font-medium tracking-tight">{!user ? 'Sign In' : ''}</span>
        )}
      </NavLink>

      {isMobileExpanded && user && (
        <button
          onClick={handleLogout}
          className="hover:bg-slate-300 dark:hover:bg-zinc-700 p-2 rounded-lg transition-colors"
          title="Logout"
        >
          <div className="inline-block text-red-600 hover:scale-125 transition-transform">
            <LuLogOut />
          </div>
        </button>
      )}
    </div>
  );
}

export default LoginAvatar;