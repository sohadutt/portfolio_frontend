import { Moon, Sun } from 'lucide-react'

export function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      aria-pressed={isDark}
      onClick={onToggle}
      className="group relative inline-flex h-11 w-24 items-center rounded-full border border-border/70 bg-background px-1.5 shadow-none backdrop-blur transition-all duration-500 hover:border-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    >
      <span className="absolute inset-1 rounded-full bg-muted/75" />
      <span
        className={`absolute left-1.5 top-1.5 h-8 w-11 rounded-full bg-background ring-1 ring-border transition-all duration-500 ${
          isDark ? 'translate-x-10' : 'translate-x-0'
        }`}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        <span className={`transition-all duration-500 ${isDark ? 'opacity-40' : 'opacity-100'}`}>
          <Sun className="size-4" />
        </span>
        <span className={`transition-all duration-500 ${isDark ? 'opacity-100' : 'opacity-40'}`}>
          <Moon className="size-4" />
        </span>
      </span>
    </button>
  )
}
