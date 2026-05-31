import { useTheme } from '../hooks/useTheme.js';
import { NavLink } from "react-router-dom"; // Adjusted to standard react-router-dom
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, googleAuth } from '../api/authApi.js';
import { useAuth } from '../hooks/useAuth.js';
import { GoogleLogin } from '@react-oauth/google'
import { toast } from "react-hot-toast";

function LoginPage() {

  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();
  
  const[formData, setFormData] = useState({
    email:'',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // input handler
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // login submit handler
  async function handleSubmit(e) {
    e.preventDefault();

    setError('');
    setLoading(true);


    try {
      const data = await loginUser(formData);

      // save auth globally
      login(data.user, data.token);

      // redirect to chat
      navigate('/');

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Login failed.');

      setError(
        err.response?.data?.error ||
        'Login failed.'
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 font-sans bg-zinc-50 text-zinc-900 dark:bg-[#1a1a1a] dark:text-zinc-100 transition-colors duration-300">
      
      {/* Outer Card Panel Wrapper */}
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900/40 p-8 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none transition-colors duration-300">
        
        {/* Headings */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-blue-600 dark:text-blue-500 hover:scale-105 transition-transform inline-block cursor-default">
            DualMind AI
          </h1>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200">
            Welcome back
          </h2>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to access your secure AI workspace
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email section */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Email address
            </label>
            <div className="mt-1.5">
              <input 
                id="email" 
                type="email" 
                name="email" 
                required 
                autoComplete="email" 
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-xl px-4 py-3 text-base sm:text-sm border transition-all duration-200
                  bg-zinc-50/50 dark:bg-zinc-900/50
                  border-zinc-200 dark:border-zinc-800 
                  text-zinc-900 dark:text-zinc-100 
                  placeholder:text-zinc-400 dark:placeholder:text-zinc-600
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500" 
              />
            </div>
          </div>

          {/* Password section */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-1.5">
              <input 
                id="password" 
                type="password" 
                name="password" 
                required 
                autoComplete="current-password" 
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-xl px-4 py-3 text-base sm:text-sm border transition-all duration-200
                  bg-zinc-50/50 dark:bg-zinc-900/50
                  border-zinc-200 dark:border-zinc-800 
                  text-zinc-900 dark:text-zinc-100 
                  placeholder:text-zinc-400 dark:placeholder:text-zinc-600
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500" 
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
            </div>
          )}  

          {/* Submit Action Button */}
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="disabled:opacity-50 flex w-full justify-center items-center rounded-xl px-4 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all duration-150 cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {/* Separator Divider Line */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-[#202020] px-3 text-zinc-400 dark:text-zinc-500 font-medium tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google SSO Button */}
          <div className="w-full flex justify-center [&>div]:w-full transition-all duration-150 active:scale-[0.99]">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await googleAuth(credentialResponse.credential);
                  login(res.user, res.token);
                  navigate('/');
                } catch (err) {
                  toast.error('Google login failed. Please try again.');
                  console.error('Google login failed:', err);
                }
              }}
              onError={() => toast.error('Google sign-in was cancelled.')}
              
              /* Configured Properties to optimize UI styling */
              text="continue_with"
              shape="pill" 
              size="large"
              width="100%"
              theme={theme === 'dark' ? 'filled_black' : 'outline'}
            />
          </div>
        </form>

        {/* Dynamic Footer Registry Context */}
        <div className="flex justify-center items-center gap-1 md:text-sm text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
          <span>Not a member?</span> 
          <NavLink to='/register' className='text-blue-600 dark:text-blue-400 hover:underline font-semibold transition-colors'>
            Create an account
          </NavLink>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;