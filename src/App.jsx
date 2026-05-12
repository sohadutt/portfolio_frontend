import { lazy, Suspense, useEffect, useState, useRef, useMemo } from "react"
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
  Link
} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Loader2 } from "lucide-react"

import { Toaster } from "@/components/ui/sonner"
import { NavBar } from "@/components/portfolio/nav-bar"
import { HeroSection } from "@/components/portfolio/hero-section"
import { AboutSection } from "@/components/portfolio/about-section"
import { WorkSection } from "@/components/portfolio/work-section"
import { ExperienceSection } from "@/components/portfolio/experience-section"
import { ComponentShowcase } from "@/components/portfolio/component-showcase"
import { ContactSection } from "@/components/portfolio/contact-section"
import { Footer } from "@/components/portfolio/footer" 
import { THEME_MAP } from "@/helper/functions"
import { useTheme } from "@/hooks/use-theme"
import { loadPublicPortfolio, selectPublicPortfolio } from "@/store/portfolioSlice"
import { GoogleOAuthProvider } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function GoogleProviderWrapper({ children }) {
  if (!GOOGLE_CLIENT_ID) {
    console.warn("Google Client ID is not set. Google OAuth features will be disabled.")
    return children
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  )
}

const LoginPage = lazy(() => import("@/components/user/LoginPage"))
const HomePage = lazy(() => import("@/components/home.jsx"))
const Terms = lazy(() => import("@/components/docs/terms"))
const Privacy = lazy(() => import("@/components/docs/privacy"))
const DashboardLayout = lazy(() => import("@/components/dashboard/DashboardRoutes"))

function PageFallback({ label = "Loading" }) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-sm font-light tracking-wide text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function withPageSuspense(children, label) {
  return (
    <Suspense fallback={<PageFallback label={label} />}>
      {children}
    </Suspense>
  )
}

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const token = localStorage.getItem("access_token")
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}

const applyTheme = (themeMode) => {
  if (themeMode === undefined || themeMode === null) return

  const root = document.documentElement
  const themeClass = THEME_MAP[themeMode] || "theme-ocean"

  Object.values(THEME_MAP).forEach((theme) => root.classList.remove(theme))
  root.classList.add(themeClass)
}

function GlobalFooter() {
  return (
    <footer className="border-t border-border/20 py-6 bg-background/50 backdrop-blur-md text-foreground z-50">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 md:h-16 md:flex-row md:py-0">
        <p className="text-center text-sm font-light tracking-wide text-muted-foreground md:text-left">
          © {new Date().getFullYear()} Portfolio Builder. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-light tracking-wide text-muted-foreground">
          <Link to="/terms" className="transition-colors hover:text-primary">
            Terms of Service
          </Link>
          <Link to="/privacy" className="transition-colors hover:text-primary">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}

function BaseLayout() {
  return (
    <div className="cinematic-ambient flex min-h-screen flex-col text-foreground">
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <GlobalFooter />
    </div>
  )
}

function PortfolioShell({ data, isDefaultPortfolio = false }) {
  const { theme, toggleTheme, mounted } = useTheme()
  const [activeHover, setActiveHover] = useState(null)
  const [navVisible, setNavVisible] = useState(true)
  
  const isScrollingRef = useRef(false)

  useEffect(() => {
    const ownerName = data?.personalInfo?.name || data?.personal_info?.name
    if (ownerName) {
      document.title = `${ownerName}'s Portfolio`
    } else {
      document.title = 'My Portfolio'
    }
  }, [data])

  useEffect(() => {
    applyTheme(data?.themeMode ?? data?.theme_mode)
  }, [data?.themeMode, data?.theme_mode])

  useEffect(() => {
    let scrollTimeout
    let ticking = false
    
    function handlePointerMove(event) {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setNavVisible((prev) => {
            const next = event.clientY <= 96 || window.scrollY < 24
            return prev === next ? prev : next 
          })
          ticking = false
        })
        ticking = true
      }
    }

    function handleScroll() {
      if (!isScrollingRef.current) {
        isScrollingRef.current = true
        document.body.style.pointerEvents = 'none' 
      }

      setNavVisible((prev) => {
        if (window.scrollY < 24 && !prev) return true
        return prev
      })

      clearTimeout(scrollTimeout)
      
      scrollTimeout = setTimeout(() => {
        isScrollingRef.current = false
        document.body.style.pointerEvents = '' 
      }, 150)
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("scroll", handleScroll, { passive: true })
    
    return () => {
      clearTimeout(scrollTimeout)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("scroll", handleScroll)
      document.body.style.pointerEvents = ''
    }
  }, [])

  const memoizedHero = useMemo(() => <HeroSection data={data} />, [data])
  const memoizedAbout = useMemo(() => <AboutSection data={data} />, [data])
  const memoizedWork = useMemo(() => <WorkSection data={data} isDefaultPortfolio={isDefaultPortfolio} />, [data, isDefaultPortfolio])
  const memoizedContact = useMemo(() => <ContactSection data={data} />, [data])
  const memoizedFooter = useMemo(() => <Footer data={data} />, [data])

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="cinematic-ambient relative flex min-h-screen flex-col text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border/20" />
      
      <NavBar
        data={data}
        theme={theme}
        onToggleTheme={toggleTheme}
        isVisible={navVisible}
        isDefaultPortfolio={isDefaultPortfolio}
        onShow={() => setNavVisible(true)}
        onHide={() => {
          if (window.scrollY >= 24) setNavVisible(false)
        }}
      />

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-28 sm:px-6 lg:gap-12 lg:px-8">
        {memoizedHero}
        {memoizedAbout}
        {memoizedWork}
        
        <ExperienceSection
          data={data}
          activeHover={activeHover}
          onRelationChange={setActiveHover}
        />
        <ComponentShowcase
          data={data}
          activeHover={activeHover}
          onRelationChange={setActiveHover}
        />
        
        {memoizedContact}
      </main>

      {memoizedFooter}
      <Toaster position="bottom-right" theme={theme === "dark" ? "dark" : "light"} />
    </div>
  )
}

function PublicPortfolioView({ token, index = 1 }) {
  const dispatch = useDispatch()
  const { data, loading } = useSelector(selectPublicPortfolio)
  const isDefaultPortfolio = !token && Number(index) === 1

  useEffect(() => {
    dispatch(loadPublicPortfolio({ token, index }))
      .unwrap()
      .catch((error) => {
        console.error("Portfolio Load Error:", error)
      })
  }, [dispatch, index, token])

  if (loading || !data) {
    return (
      <div className="cinematic-ambient flex h-screen w-full items-center justify-center text-foreground px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative flex items-center justify-center">
            {/* DeepMind Style Loader Glow */}
            <div className="absolute h-24 w-24 rounded-full bg-primary/20 blur-[40px]" />
            <Loader2 className="relative size-10 animate-spin text-primary" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Loading Portfolio
            </p>
            <p className="text-sm font-light text-muted-foreground">Preparing the showcase experience.</p>
            <p className="text-xs font-light text-muted-foreground/50">First load can take up to 30s due to server spin-up.</p>
          </div>
        </div>
      </div>
    )
  }

  return <PortfolioShell data={data} isDefaultPortfolio={isDefaultPortfolio} />
}

function DefaultPortfolioRoute() {
  const { index } = useParams()
  return <PublicPortfolioView index={Number(index || 1)} />
}

function SharedPortfolioRoute() {
  const { token, index } = useParams()
  return <PublicPortfolioView token={token} index={Number(index || 1)} />
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultPortfolioRoute />} />
        <Route path="/home" element={withPageSuspense(<HomePage />, "Loading home")} />
        <Route path="/hpme" element={<Navigate to="/home" replace />} />
        <Route path="/preview/:index" element={<DefaultPortfolioRoute />} />
        <Route path="/portfolio/:token" element={<SharedPortfolioRoute />} />
        <Route path="/portfolio/:token/:index" element={<SharedPortfolioRoute />} />

        <Route element={<BaseLayout />}>
          <Route path="/login" element={withPageSuspense(<LoginPage />, "Loading login")} />
          <Route path="/terms" element={withPageSuspense(<Terms />, "Loading terms")} />
          <Route path="/privacy" element={withPageSuspense(<Privacy />, "Loading privacy")} />
        </Route>

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              {withPageSuspense(<DashboardLayout />, "Loading dashboard")}
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <GoogleProviderWrapper>
      <AppRouter />
    </GoogleProviderWrapper>
  )
}