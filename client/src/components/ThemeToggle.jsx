import { useTheme } from '../hooks/useTheme';

function ThemeToggle() {

    const { toggleTheme, isDark } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg border bg-blue-400"
        >
            {isDark ? '🌙 Dark' : '☀️ Light'}
        </button>
    );
}

export default ThemeToggle;