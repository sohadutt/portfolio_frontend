import { Moon, Sun } from 'lucide-react'

export function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      aria-pressed={isDark}
      onClick={onToggle}
      className="group relative inline-flex h-10 w-20 items-center rounded-full border border-border/40 bg-card/30 px-1 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 shadow-none"
    >
      {/* Deep Background Track */}
      <span className="absolute inset-1 rounded-full bg-background/60" />
      
      {/* Sliding Cinematic Thumb */}
      <span
        className={`absolute left-1 top-1 h-8 w-9 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isDark 
            ? 'translate-x-9 bg-primary/20 border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.3)]' 
            : 'translate-x-0 bg-foreground/10 border border-border/50 shadow-sm'
        }`}
      />
      
      {/* Icons */}
      <span className="relative z-10 flex w-full items-center justify-between px-2.5">
        <span 
          className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center ${
            isDark ? 'text-muted-foreground/40 scale-75' : 'text-foreground scale-100'
          }`}
        >
          <Sun className="size-4" />
        </span>
        <span 
          className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center ${
            isDark ? 'text-primary scale-100' : 'text-muted-foreground/40 scale-75'
          }`}
        >
          <Moon className="size-4" />
        </span>
      </span>
    </button>
  )
}