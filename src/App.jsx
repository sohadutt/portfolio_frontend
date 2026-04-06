import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { ReactLenis } from 'lenis/react'
import { Loader2 } from 'lucide-react'

// UI Components
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SideProfile } from "@/components/user/SideProfile"
import { Toaster } from "@/components/ui/sonner"

// Pages & Sections
import LoginPage from '@/components/user/LoginPage'
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

/* ---------------- PROTECTED ROUTE ---------------- */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

/* ---------------- THEME HELPER ---------------- */
const applyTheme = (themeMode) => {
  if (themeMode === undefined) return

  const root = document.documentElement
  const themeClass = THEME_MAP[themeMode] || 'theme-ocean'

  Object.values(THEME_MAP).forEach(t => root.classList.remove(t))
  root.classList.add(themeClass)
}

/* ---------------- PUBLIC VIEW ---------------- */
function PublicPortfolioView() {
  const { token } = useParams()
  const { theme, toggleTheme, mounted } = useTheme()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const [activeHover, setActiveHover] = useState(null)
  const [navVisible, setNavVisible] = useState(true)
  const [isScrolling, setIsScrolling] = useState(false)

  /* Fetch Data */
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

  /* Apply Theme */
  useEffect(() => {
    applyTheme(data?.theme_mode)
  }, [data?.theme_mode])

  /* Nav Behavior */
  useEffect(() => {
    let scrollTimeout

    function handlePointerMove(event) {
      setNavVisible(event.clientY <= 96 || window.scrollY < 24)
    }

    function handleScroll() {
      setIsScrolling(true)
      if (window.scrollY < 24) setNavVisible(true)

      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => setIsScrolling(false), 140)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearTimeout(scrollTimeout)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!mounted || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <ReactLenis root options={{ duration: 1.1, smoothWheel: true }}>
      <div className="relative flex min-h-screen flex-col bg-background text-foreground">

        <NavBar
          theme={theme}
          onToggleTheme={toggleTheme}
          isVisible={navVisible}
          onShow={() => setNavVisible(true)}
          onHide={() => { if (window.scrollY >= 24) setNavVisible(false) }}
        />

        <main className="mx-auto w-full max-w-7xl flex flex-col gap-10 px-4 pt-24 pb-16 sm:px-6 lg:px-8">
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
        <Toaster position="bottom-right" />
      </div>
    </ReactLenis>
  )
}

/* ---------------- DASHBOARD VIEW ---------------- */
function DashboardView() {
  const { theme, toggleTheme, mounted } = useTheme()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const [activeHover, setActiveHover] = useState(null)
  const [navVisible, setNavVisible] = useState(true)
  const [isScrolling, setIsScrolling] = useState(false)

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

  useEffect(() => {
    applyTheme(data?.theme_mode)
  }, [data?.theme_mode])

  useEffect(() => {
    let scrollTimeout

    function handlePointerMove(event) {
      setNavVisible(event.clientY <= 96 || window.scrollY < 24)
    }

    function handleScroll() {
      setIsScrolling(true)
      if (window.scrollY < 24) setNavVisible(true)

      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => setIsScrolling(false), 140)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearTimeout(scrollTimeout)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!mounted || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <ReactLenis root options={{ duration: 1.1, smoothWheel: true }}>
      <SidebarProvider>
        <div className="flex min-h-screen bg-background text-foreground">

          <SideProfile profileData={data} />

          <div className="relative flex-1">
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

            <main className="mx-auto w-full max-w-7xl flex flex-col gap-10 px-4 pt-24 pb-16 sm:px-6 lg:px-8">
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

/* ---------------- APP ROOT ---------------- */
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