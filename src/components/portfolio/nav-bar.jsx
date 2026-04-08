import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/portfolio/theme-toggle'
import { getNavigationLinks, getPortfolioPersonalInfo, getPortfolioProfileImage } from '@/helper/portfolio-data'

export function NavBar({ data, theme, onToggleTheme, isVisible, onShow, onHide, isDefaultPortfolio = false }) {
  const personalInfo = getPortfolioPersonalInfo(data)
  const profileImage = getPortfolioProfileImage(data)
  const navigationLinks = getNavigationLinks(data)
  const fallbackInitials = personalInfo.shortName || personalInfo.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'SD'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-[calc(100%-1rem)] opacity-0'
      }`}
      onMouseEnter={onShow}
      onMouseLeave={onHide}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between rounded-full border border-border/60 bg-background/92 px-3 py-2 shadow-sm backdrop-blur">
          <a href="#" className="flex items-center gap-3 rounded-full px-2.5 py-2 transition-colors hover:bg-muted/55">
            <Avatar
              className={
                isDefaultPortfolio
                  ? 'size-12 border border-border shadow-sm'
                  : 'size-10 border border-border shadow-sm'
              }
            >
              <AvatarImage src={profileImage || undefined} alt={personalInfo.name} />
              <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
                {fallbackInitials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:grid sm:gap-1.5">
              <p className="text-sm font-semibold leading-none text-foreground">
                {personalInfo.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {personalInfo.title}
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {navigationLinks.map((link) => (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href || '#'}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <Button asChild className="hidden rounded-full px-6 font-medium shadow-none sm:inline-flex">
              <a href="/login?mode=signup&source=portfolio-builder">Make your portfolio</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
