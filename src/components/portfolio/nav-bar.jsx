import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/portfolio/theme-toggle'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'

export function NavBar({ data = {}, theme, onToggleTheme, isVisible, onShow, onHide, isDefaultPortfolio = false }) {
  const [isOpen, setIsOpen] = useState(false)

  // Safely extract data from the API payload
  const personalInfo = data.personalInfo || {}
  
  // Safely grab the profile image regardless of where the backend nested it
  const profileImage = 
    data.profile_picture ||
    data.profilePicture ||
    personalInfo.profile_picture ||
    personalInfo.profilePicture ||
    null

  const rawLinks = data.navigationLinks || data.navigation_links || []
  const navigationLinks = Array.isArray(rawLinks) ? rawLinks : []

  // Create clean fallback initials (e.g., "Jane Doe" -> "JD")
  const fallbackInitials = 
    personalInfo.shortName || 
    (personalInfo.name ? personalInfo.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() : 'SD')

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
              <AvatarImage src={profileImage || undefined} alt={personalInfo.name || "Portfolio Owner"} />
              <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
                {fallbackInitials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:grid sm:gap-1.5">
              <p className="text-sm font-semibold leading-none text-foreground">
                {personalInfo.name || "Your Name"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {personalInfo.title || "Your Title"}
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navigationLinks.map((link, index) => (
              <a
                key={`${link.label || 'link'}-${index}`}
                href={link.href || '#'}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label || "Link"}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            
            {/* Desktop CTA */}
            <Button asChild className="hidden rounded-full px-6 font-medium shadow-none sm:inline-flex">
              <a href="/login?mode=signup&source=portfolio-builder">Make your portfolio</a>
            </Button>

            {/* Mobile Navigation Sheet */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full lg:hidden">
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              
              {/* Refined Mobile Drawer Styling */}
              <SheetContent side="right" className="flex w-[85vw] flex-col px-6 py-8 sm:w-[400px]">
                <SheetTitle className="text-left text-lg font-semibold tracking-tight text-foreground">
                  Menu
                </SheetTitle>
                
                <div className="mt-8 flex flex-col h-full">
                  <nav className="flex flex-col gap-6">
                    {navigationLinks.map((link, index) => (
                      <a
                        key={`mobile-${link.label || 'link'}-${index}`}
                        href={link.href || '#'}
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label || "Link"}
                      </a>
                    ))}
                  </nav>
                  
                  {/* Mobile CTA properly aligned with margin-top instead of auto-bottom */}
                  <div className="mt-10 sm:hidden">
                    <Button asChild size="lg" className="w-full rounded-full shadow-none font-semibold">
                      <a href="/login?mode=signup&source=portfolio-builder">Make your portfolio</a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}