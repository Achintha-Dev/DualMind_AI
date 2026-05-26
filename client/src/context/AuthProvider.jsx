import { useEffect, useState } from 'react'
import { getCurrentUser } from '../api/authApi.js'
import { AuthContext } from './AuthContext.jsx';

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function initAuth() {
            const token = localStorage.getItem('token');

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const data = await getCurrentUser();
                setUser(data.user);

            } catch (error) {
                console.error(error);

                localStorage.removeItem('token');
                setUser(null);

            } finally {
                setLoading(false);
            }
        }
        initAuth();
    },[]);

    function login(userData, token) {
        localStorage.setItem('token', token);
        setUser(userData);
    }
    
    function logout() {
        localStorage.removeItem('token');
        setUser(null);
    }
  return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider