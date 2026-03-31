import { Button } from '@/components/ui/button'
import { navigationLinks, personalInfo } from '@/data/portfolio'
import { ThemeToggle } from '@/components/portfolio/theme-toggle'

export function NavBar({ theme, onToggleTheme }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between rounded-full border border-border/60 bg-background/80 px-3 py-2 shadow-[0_18px_60px_-32px_rgba(15,23,42,0.8)] backdrop-blur-xl">
          <a href="#" className="flex items-center gap-3 rounded-full px-3 py-2 transition-colors hover:bg-muted/70">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {personalInfo.shortName}
            </span>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold">{personalInfo.name}</p>
              <p className="text-xs text-muted-foreground">{personalInfo.title}</p>
            </div>
          </a>
          <nav className="hidden items-center gap-1 lg:flex">
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <Button asChild className="hidden rounded-full px-5 sm:inline-flex">
              <a href="#contact">Let&apos;s build</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
