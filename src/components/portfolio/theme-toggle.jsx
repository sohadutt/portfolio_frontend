import { Moon, Sun } from 'lucide-react'

export function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      aria-pressed={isDark}
      onClick={onToggle}
      className="group relative inline-flex h-11 w-24 items-center rounded-full border border-border/70 bg-card/85 px-1.5 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.65)] backdrop-blur transition-all duration-500 hover:border-primary/50 hover:shadow-[0_14px_34px_-18px_rgba(225,98,54,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <span className="absolute inset-1 rounded-full bg-muted/70" />
      <span
        className={`absolute left-1.5 top-1.5 h-8 w-11 rounded-full bg-primary shadow-lg transition-all duration-500 ${
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
