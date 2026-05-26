import { useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';

function ThemeProvider({ children }) {

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });

    useEffect(() => {

        console.log('Current theme:', theme);
        
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');

        root.classList.add(theme);

        localStorage.setItem('theme', theme);

    }, [theme]);

    function toggleTheme() {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    }

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme,
                isDark: theme === 'dark',
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;