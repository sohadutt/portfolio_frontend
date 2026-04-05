import { useEffect, useState } from 'react'
import { ReactLenis } from 'lenis/react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SideProfile } from "@/components/user/profile" // Adjust path to your sidebar file
import { get_user_profile } from "@/helper/functions"
import { Toaster } from "@/components/ui/sonner"

// Import your sections
import { NavBar } from '@/components/portfolio/nav-bar'
import { HeroSection } from '@/components/portfolio/hero-section'
import { AboutSection } from '@/components/portfolio/about-section'
import { WorkSection } from '@/components/portfolio/work-section'
import { ExperienceSection } from '@/components/portfolio/experience-section'
import { ComponentShowcase } from '@/components/portfolio/component-showcase'
import { ContactSection } from '@/components/portfolio/contact-section'
import { Footer } from '@/components/portfolio/footer'

import { useTheme } from '@/hooks/use-theme'
import 'lenis/dist/lenis.css'

function App() {
  const { theme, toggleTheme, mounted } = useTheme()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const [activeHover, setActiveHover] = useState(null)
  const [navVisible, setNavVisible] = useState(true)
  const [isScrolling, setIsScrolling] = useState(false)

  // 1. Fetch User Data on Mount
  useEffect(() => {
    get_user_profile()
      .then((res) => {
        setData(res)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err)
        setLoading(false)
      })
  }, [])

  // Navigation and Scroll Logic
  useEffect(() => {
    function handlePointerMove(event) {
      setNavVisible(event.clientY <= 96 || window.scrollY < 24)
    }
    let scrollTimeout
    function handleScroll() {
      setIsScrolling(true)
      if (window.scrollY < 24) setNavVisible(true)
      window.clearTimeout(scrollTimeout)
      scrollTimeout = window.setTimeout(() => setIsScrolling(false), 140)
    }
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.clearTimeout(scrollTimeout)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!mounted || loading) return null

  return (
    <ReactLenis root options={{ duration: 1.1, smoothWheel: true, wheelMultiplier: 0.9 }}>
      {/* 2. Wrap everything in SidebarProvider */}
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background text-foreground">
          
          {/* 3. Your Editable Sidebar */}
          <SideProfile profileData={data} />

          <div className="relative flex-1 overflow-x-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(225,98,54,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(33,119,116,0.12),_transparent_28%)]" />
            
            <NavBar
              theme={theme}
              onToggleTheme={toggleTheme}
              isVisible={navVisible}
              onShow={() => setNavVisible(true)}
              onHide={() => { if (window.scrollY >= 24) setNavVisible(false) }}
            />

            {/* Sidebar Trigger - Floating or inside main */}
            <div className="fixed left-4 top-4 z-50 md:hidden">
              <SidebarTrigger />
            </div>

            <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
              <HeroSection isScrolling={isScrolling} />
              <AboutSection isScrolling={isScrolling} />
              <WorkSection isScrolling={isScrolling} />
              <ExperienceSection
                isScrolling={isScrolling}
                activeHover={activeHover}
                onRelationChange={setActiveHover}
              />
              <ComponentShowcase
                isScrolling={isScrolling}
                activeHover={activeHover}
                onRelationChange={setActiveHover}
              />
              <ContactSection isScrolling={isScrolling} />
            </main>

            <Footer isScrolling={isScrolling} />
          </div>
        </div>
        <Toaster position="bottom-right" />
      </SidebarProvider>
    </ReactLenis>
  )
}

export default App