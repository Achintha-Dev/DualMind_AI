import ThemeToggle from '../components/ThemeToggle'

function HomePage() {
  return (
    <div className="min-h-screen p-10 transition-colors duration-300 bg-white text-black dark:bg-zinc-900 dark:text-white">
        <h1 className="text-2xl font-bold mb-4">HomePage</h1>
        <ThemeToggle />
        
        {/* Test card to confirm it works */}
        <div className="mt-6 p-6 max-w-sm rounded-lg shadow-md bg-zinc-100 text-black dark:bg-zinc-800 dark:text-white">
            <h2 className="text-xl font-semibold">DaisyUI Card Component</h2>
            <p className="text-sm mt-2">Tailwind utility classes are fully controlling this now.</p>
        </div>
    </div>
  )
}

export default HomePage