import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { ReactLenis } from 'lenis/react'

// UI Components
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SideProfile } from "@/components/user/SideProfile"
import { Toaster } from "@/components/ui/sonner"

// Portfolio Sections
import { NavBar } from '@/components/portfolio/nav-bar'
import { HeroSection } from '@/components/portfolio/hero-section'
import { AboutSection } from '@/components/portfolio/about-section'
import { WorkSection } from '@/components/portfolio/work-section'
import { ExperienceSection } from '@/components/portfolio/experience-section'
import { ComponentShowcase } from '@/components/portfolio/component-showcase'
import { ContactSection } from '@/components/portfolio/contact-section'
import { Footer } from '@/components/portfolio/footer'

// Helpers & Hooks
import { getUserProfile, fetchPublicPortfolio, THEME_MAP } from "@/helper/functions"
import { useTheme } from '@/hooks/use-theme'
import 'lenis/dist/lenis.css'

/**
 * 1. Protected Route Component
 * Redirects to /login if no access token is found in localStorage
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

/**
 * 2. Login Placeholder
 */
const LoginPage = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-black uppercase tracking-tighter">Login</h1>
      <p className="text-muted-foreground">Login functionality coming soon...</p>
      <div className="p-4 border border-dashed rounded-lg text-xs font-mono">
        Manually set 'access_token' in LocalStorage to access /dashboard.
      </div>
    </div>
  </div>
)

/**
 * 3. Public Portfolio View (For visitors)
 * Displays the portfolio without the editing sidebar.
 * Handles both '/' (default) and '/portfolio/:token' (shared links).
 */
function PublicPortfolioView() {
  const { token } = useParams()
  const { theme, toggleTheme, mounted } = useTheme()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const [activeHover, setActiveHover] = useState(null)
  const [navVisible, setNavVisible] = useState(true)
  const [isScrolling, setIsScrolling] = useState(false)

  // Fetch Public Portfolio Data
  useEffect(() => {
    setLoading(true)
    fetchPublicPortfolio(token)
      .then((res) => {
        setData(res)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Public Portfolio Load Error:", err)
        setLoading(false)
      })
  }, [token])

  // Apply Theme Dynamically based on backend data
  useEffect(() => {
    if (data?.theme_mode !== undefined) {
      const themeClass = THEME_MAP[data.theme_mode] || 'theme-ocean'
      const root = document.documentElement
      
      // Clear old themes and apply the new one
      Object.values(THEME_MAP).forEach(t => root.classList.remove(t))
      root.classList.add(themeClass)
    }
  }, [data?.theme_mode])

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

  if (!mounted || loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )

  return (
    <ReactLenis root options={{ duration: 1.1, smoothWheel: true, wheelMultiplier: 0.9 }}>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background text-foreground">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(225,98,54,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(33,119,116,0.12),_transparent_28%)]" />
        
        <NavBar
          theme={theme}
          onToggleTheme={toggleTheme}
          isVisible={navVisible}
          onShow={() => setNavVisible(true)}
          onHide={() => { if (window.scrollY >= 24) setNavVisible(false) }}
        />

        <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          {/* Passed data down to sections so they can use live API values */}
          <HeroSection data={data} isScrolling={isScrolling} />
          <AboutSection data={data} isScrolling={isScrolling} />
          <WorkSection data={data} isScrolling={isScrolling} />
          <ExperienceSection
            data={data}
            isScrolling={isScrolling}
            activeHover={activeHover}
            onRelationChange={(next) => !isScrolling && setActiveHover(next)}
          />
          <ComponentShowcase
            data={data}
            isScrolling={isScrolling}
            activeHover={activeHover}
            onRelationChange={(next) => !isScrolling && setActiveHover(next)}
          />
          <ContactSection data={data} isScrolling={isScrolling} />
        </main>

        <Footer data={data} isScrolling={isScrolling} />
      </div>
      <Toaster position="bottom-right" />
    </ReactLenis>
  )
}

/**
 * 4. Main Dashboard View (For You)
 * Contains the Sidebar AND the Portfolio sections
 */
function DashboardView() {
  const { theme, toggleTheme, mounted } = useTheme()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const [activeHover, setActiveHover] = useState(null)
  const [navVisible, setNavVisible] = useState(true)
  const [isScrolling, setIsScrolling] = useState(false)

  // Fetch Private User Profile
  useEffect(() => {
    getUserProfile()
      .then((res) => {
        setData(res)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Dashboard Load Error:", err)
        setLoading(false)
      })
  }, [])

  // Apply Theme Dynamically based on backend data
  useEffect(() => {
    if (data?.theme_mode !== undefined) {
      const themeClass = THEME_MAP[data.theme_mode] || 'theme-ocean'
      const root = document.documentElement
      
      // Clear old themes and apply the new one
      Object.values(THEME_MAP).forEach(t => root.classList.remove(t))
      root.classList.add(themeClass)
    }
  }, [data?.theme_mode])

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

  if (!mounted || loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )

  return (
    <ReactLenis root options={{ duration: 1.1, smoothWheel: true, wheelMultiplier: 0.9 }}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background text-foreground">
          
          {/* Editable Sidebar */}
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

            <div className="fixed left-4 top-4 z-50 md:hidden">
              <SidebarTrigger />
            </div>

            <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
              <HeroSection data={data} isScrolling={isScrolling} />
              <AboutSection data={data} isScrolling={isScrolling} />
              <WorkSection data={data} isScrolling={isScrolling} />
              <ExperienceSection
                data={data}
                isScrolling={isScrolling}
                activeHover={activeHover}
                onRelationChange={(next) => !isScrolling && setActiveHover(next)}
              />
              <ComponentShowcase
                data={data}
                isScrolling={isScrolling}
                activeHover={activeHover}
                onRelationChange={(next) => !isScrolling && setActiveHover(next)}
              />
              <ContactSection data={data} isScrolling={isScrolling} />
            </main>

            <Footer data={data} isScrolling={isScrolling} />
          </div>
        </div>
        <Toaster position="bottom-right" />
      </SidebarProvider>
    </ReactLenis>
  )
}

/**
 * 5. Root App Component (Router)
 */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicPortfolioView />} />
        <Route path="/portfolio/:token" element={<PublicPortfolioView />} />
        
        <Route path="/login" element={<LoginPage />} />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardView />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}