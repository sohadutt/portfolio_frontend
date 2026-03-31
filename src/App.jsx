import { NavBar } from '@/components/portfolio/nav-bar'
import { HeroSection } from '@/components/portfolio/hero-section'
import { AboutSection } from '@/components/portfolio/about-section'
import { WorkSection } from '@/components/portfolio/work-section'
import { ExperienceSection } from '@/components/portfolio/experience-section'
import { ComponentShowcase } from '@/components/portfolio/component-showcase'
import { ContactSection } from '@/components/portfolio/contact-section'
import { Footer } from '@/components/portfolio/footer'
import { useTheme } from '@/hooks/use-theme'

function App() {
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) {
    return null
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(225,98,54,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(33,119,116,0.12),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.08),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(244,145,77,0.2),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(72,184,173,0.16),_transparent_26%),linear-gradient(180deg,_rgba(255,255,255,0.03),_transparent_30%)]" />
      <NavBar theme={theme} onToggleTheme={toggleTheme} />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <HeroSection />
        <AboutSection />
        <WorkSection />
        <ExperienceSection />
        {/* <ComponentShowcase /> */}
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
