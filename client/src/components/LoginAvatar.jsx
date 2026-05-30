import { NavLink, useNavigate } from "react-router";
import { getCurrentUser } from '../api/authApi'
import { useEffect, useState } from "react";
import { LuLogOut } from "react-icons/lu";
import { toast } from "react-hot-toast";


function LoginAvatar({isMobileExpanded}) {
  const[user, setUser] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if(!token) return;

    async function getUser() {
      try {
        const data = await getCurrentUser();
        
        setUser(data.user);
        // console.log(data.user.name);

      } catch (error) {
        console.error(`Failed fetch current user: ${error}`);
      }
    }
    getUser();
  }, [token]);

  // logout function
  function handleLogout(){
    localStorage.removeItem('token');
    toast.success('Your successfully logout');
    navigate('/');
  }


  return (
    <div className={`flex items-center gap-3 group text-teal-600 dark:text-teal-400 hover:opacity-80 transition-opacity w-full ${isMobileExpanded ? 'px-2' : 'justify-center flex-col'}`}>
      {/* popup */}
      

        {/*Button */}
        <NavLink to='/login' className={`hover:dark:bg-slate-300/10 hover:bg-slate-200 rounded-lg p-2 
            flex items-center gap-3 
            ${isMobileExpanded? 'justify-start w-48' : 'justify-center flex-col'}
          `}>
          
          <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center shrink-0">
            { token ? <p>{user?.name?.charAt(0)}</p> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>}
            </div>
            {isMobileExpanded ? (
              <div className="text-right inline-block">
                <p className="text-sm font-bold leading-tight text-zinc-800 dark:text-zinc-200">
                  {token ? user.name: 'Account'}
                </p>
                <p className="text-[11px] text-zinc-400">{!token ? 'Login': ''}</p>
              </div>
            ) : (
              <span className="text-[10px] font-medium tracking-tight">{!token ? 'Sign In': ''}</span>
            )}
            
        </NavLink>

        {isMobileExpanded ? (<button onClick={handleLogout} className="hover:bg-slate-300 p-2 rounded-lg " title="logout">
          {!token ? '': <div className="inline-block text-red-700 hover:scale-125"><LuLogOut /></div>}
        </button>): ''}

    </div>
  )
}

export default LoginAvatar