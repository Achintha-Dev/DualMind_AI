import { FiCpu } from "react-icons/fi";

function Loading() {
  return (
    <div className="flex w-full flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-[#1a1a1a] transition-colors duration-300">
      
      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-10">
        
        {/* 💧 FLUID MORPHING CONTAINER (Inspired by the Rive Motion) */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
          
          {/* Layer 1: Outer Liquid Glow Aura (Slow morphing transform) */}
          <div 
            className="absolute inset-0 bg-gradient-to-tr dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-teal-400/20 from-blue-500/70 via-indigo-500/70 to-teal-400/70 
            blur-xl animate-[morph_6s_infinite_ease-in-out_alternate]" 
          />
          
          {/* Layer 2: Secondary Organic Liquid Shape (Rotated & mid-speed morph) */}
          <div className="absolute inset-2 bg-gradient-to-bl from-teal-400/30 via-blue-500/20 to-indigo-500/40 mix-blend-multiply dark:mix-blend-screen animate-[morph_4s_infinite_ease-in-out_alternate-reverse] [animation-delay:0.5s]" />
          
          {/* Layer 3: Central Liquid Shape holding the core system identifier */}
          <div className="absolute inset-4 bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 shadow-lg shadow-blue-500/20 flex items-center justify-center animate-[morph_5s_infinite_ease-in-out_alternate]">
            <FiCpu size={28} className="text-white animate-pulse size-4 sm:size-10" />
          </div>

        </div>

        {/* 💬 INTERACTIVE TYPING TRACKER */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-1.5 h-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              DualMind is typing
            </span>
            {/* Soft, minimal rhythm dots to mimic natural cadence */}
            <div className="flex gap-1 items-center pt-1">
              <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce [animation-duration:0.6s]" />
              <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce [animation-duration:0.6s] [animation-delay:0.15s]" />
              <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce [animation-duration:0.6s] [animation-delay:0.3s]" />
            </div>
          </div>
          
          <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-[250px] mx-auto leading-relaxed">
            Synthesizing code structures and organizing workspace environments...
          </p>
        </div>

      </div>
    </div>
  );
}

export default Loading;