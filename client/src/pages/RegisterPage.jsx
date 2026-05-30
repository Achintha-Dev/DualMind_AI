import { GrGoogle } from "react-icons/gr";
import { NavLink } from "react-router-dom";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authApi.js';
import { useAuth } from '../hooks/useAuth.js';
import { toast } from "react-hot-toast";


function RegisterPage() {
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const[formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

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

    if(formData.firstName.length === 0){
      toast.error('Fist name required.');
      setError('First name required.');
      return 
    }

    if(formData.lastName.length === 0){
      toast.error('Last name required.');
      setError('Last name required.');
      return 
    }

    if (!formData.email.trim()) {
      toast.error('Email required.');
      return;
    }

    if (!formData.password.trim()) {
      toast.error('Password required.');
      return;
    }

    setLoading(true);

    try {

      const payLoad = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
      }

      const data = await registerUser(payLoad);

      // save auth globally
      login(data.user, data.token);

      // redirect to login
      navigate('/');

    } catch (err) {
      console.error(err);

      toast.error( err.response?.data?.error ||'Registration failed.');

      setError(
        err.response?.data?.error ||
        'Registration failed.'
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
            Create your account
          </h2>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            Get started with your collaborative intelligent workspace
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* First & Last Name Grid Layout */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                First name
              </label>
              <div className="mt-1.5">
                <input 
                  id="firstName" 
                  type="text" 
                  name="firstName" 
                  required 
                  placeholder="John"
                  value={formData.firstName}
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

            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Last name
              </label>
              <div className="mt-1.5">
                <input 
                  id="lastName" 
                  type="text" 
                  name="lastName" 
                  required 
                  placeholder="Doe"
                  value={formData.lastName}
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
          </div>

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
            <label htmlFor="password" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <div className="mt-1.5">
              <input 
                id="password" 
                type="password" 
                name="password" 
                required 
                autoComplete="new-password" 
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
              {loading ? 'Registering...':'Get started'}
            </button>
          </div>

          {/* Separator Divider Line */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-[#202020] px-3 text-zinc-400 dark:text-zinc-500 font-medium tracking-wider">
                Or sign up with
              </span>
            </div>
          </div>

          {/* Google SSO Button */}
          <div>
            <button 
              type="button" 
              className="flex w-full justify-center items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold border transition-all duration-150 active:scale-[0.98] cursor-pointer
                bg-white dark:bg-transparent
                border-zinc-200 dark:border-zinc-800 
                text-zinc-700 dark:text-zinc-300 
                hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
            >
              <GrGoogle className="text-base text-green-500 dark:text-zinc-300" />
              Google
            </button>
          </div>
        </form>

        {/* Dynamic Footer Sign-In Context */}
        <div className="flex justify-center items-center gap-1 md:text-sm text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
          <span>Already have an account?</span> 
          <NavLink to='/login' className='text-blue-600 dark:text-blue-400 hover:underline font-semibold transition-colors'>
            Sign in
          </NavLink>
        </div>

      </div>
    </div>
  );
}

export default RegisterPage;