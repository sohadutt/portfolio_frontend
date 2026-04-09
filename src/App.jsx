import { useEffect, useState } from "react"
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useOutletContext,
  useParams,
  Link // Added Link for the GlobalFooter
} from "react-router-dom"
import { ReactLenis } from "lenis/react"
import { BriefcaseBusiness, FolderKanban, LayoutDashboard, Loader2, Mail, Moon, Sun } from "lucide-react"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SideProfile } from "@/components/user/SideProfile"
import { Toaster } from "@/components/ui/sonner"
import LoginPage from "@/components/user/LoginPage"
import PortfolioManager from "@/components/dashboard/PortfolioManager"
import PortfolioEditor from "@/components/dashboard/PortfolioEditor"
import SubmissionInbox from "@/components/dashboard/SubmissionInbox"
import LucideIconBrowser from "@/components/dashboard/LucideIconBrowser"
import { NavBar } from "@/components/portfolio/nav-bar"
import { HeroSection } from "@/components/portfolio/hero-section"
import { AboutSection } from "@/components/portfolio/about-section"
import { WorkSection } from "@/components/portfolio/work-section"
import { ExperienceSection } from "@/components/portfolio/experience-section"
import { ComponentShowcase } from "@/components/portfolio/component-showcase"
import { ContactSection } from "@/components/portfolio/contact-section"
import { Footer } from "@/components/portfolio/footer" // Your specific portfolio footer
import { fetchPublicPortfolio, getUserProfile, THEME_MAP } from "@/helper/functions"
import { useTheme } from "@/hooks/use-theme"
import { Button } from "@/components/ui/button"
import "lenis/dist/lenis.css"

import Terms from "@/components/docs/terms"
import Privacy from "@/components/docs/privacy"

const dashboardLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/portfolios", label: "Portfolios", icon: FolderKanban },
  { to: "/dashboard/submissions", label: "Submissions", icon: Mail },
]

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token")
  if (!token) return <Navigate to="/login" replace />
  return children
}

const applyTheme = (themeMode) => {
  if (themeMode === undefined || themeMode === null) return

  const root = document.documentElement
  const themeClass = THEME_MAP[themeMode] || "theme-ocean"

  Object.values(THEME_MAP).forEach((theme) => root.classList.remove(theme))
  root.classList.add(themeClass)
}

// --- GLOBAL FOOTER FOR STANDARD PAGES ---
function GlobalFooter() {
  return (
    <footer className="border-t py-6 bg-background text-foreground z-50">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 md:h-16 md:flex-row md:py-0">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} Portfolio Builder. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link to="/terms" className="hover:underline underline-offset-4 hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link to="/privacy" className="hover:underline underline-offset-4 hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}

// --- BASE LAYOUT FOR STANDARD PAGES (Login, Terms, Privacy) ---
function BaseLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1 flex flex-col">
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
  const [isScrolling, setIsScrolling] = useState(false)

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
    function handlePointerMove(event) {
      setNavVisible(event.clientY <= 96 || window.scrollY < 24)
    }
    function handleScroll() {
      setIsScrolling(true)
      if (window.scrollY < 24) setNavVisible(true)
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => setIsScrolling(false), 140)
    }
    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      clearTimeout(scrollTimeout)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <ReactLenis root options={{ duration: 1.1, smoothWheel: true }}>
      <div className="relative flex min-h-screen flex-col bg-muted/30 text-foreground">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_42%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_42%)]" />
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

        <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <HeroSection data={data} isScrolling={isScrolling} />
          <AboutSection data={data} isScrolling={isScrolling} />
          <WorkSection data={data} isScrolling={isScrolling} isDefaultPortfolio={isDefaultPortfolio} />
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

function PublicPortfolioView({ token, index = 1 }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const isDefaultPortfolio = !token && Number(index) === 1

  useEffect(() => {
    let isMounted = true

    fetchPublicPortfolio(token, index)
      .then((response) => {
        if (!isMounted) return
        setData(response)
      })
      .catch((error) => {
        console.error("Portfolio Load Error:", error)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [index, token])

  if (loading || !data) {
    if (isDefaultPortfolio) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl" />
              <Loader2 className="relative size-8 animate-spin text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/90">Loading portfolio</p>
              <p className="text-sm text-slate-300">Preparing the showcase experience.</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
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

function DashboardOverview() {
  const { profile } = useOutletContext()

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-4">
        <article className="rounded-3xl border bg-card p-7 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Account</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">@{profile?.username}</p>
          <p className="mt-2 text-sm text-muted-foreground">{profile?.email}</p>
        </article>

        <article className="rounded-3xl border bg-card p-7 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Portfolio Access</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {profile?.enable_share_token ? "Public" : "Private"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {profile?.portfolio_count || 0} portfolio{profile?.portfolio_count === 1 ? "" : "s"} tracked
          </p>
        </article>

        <article className="rounded-3xl border bg-card p-7 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Theme</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {(THEME_MAP[profile?.theme_mode] || "theme-ocean").replace("theme-", "")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {profile?.is_verified ? "Verified account" : "Email verification still pending"}
          </p>
        </article>
      </section>

      <section className="rounded-3xl border bg-card p-7 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BriefcaseBusiness className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Workspace</h2>
            <p className="text-sm text-muted-foreground">
              Use the dashboard routes above to manage portfolios, update content, and review contact submissions.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function EditPortfolioRoute() {
  const { index } = useParams()
  return <PortfolioEditor portfolioIndex={Number(index || 1)} />
}

function DashboardLayout() {
  const { theme, setTheme } = useTheme()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    document.title = 'Dashboard | Portfolio Builder'

    getUserProfile()
      .then((response) => {
        if (!isMounted) return
        setProfile(response)
        applyTheme(response?.theme_mode)
      })
      .catch((error) => {
        console.error("Dashboard Load Error:", error)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (loading || !profile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm tracking-[0.18em] text-slate-300 uppercase">Loading dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "14.5rem",
        "--sidebar-width-icon": "3.5rem",
      }}
    >
      <div className="flex min-h-screen w-full bg-muted/20 text-foreground">
        <SideProfile profileData={profile} />

        <SidebarInset className="min-w-0 bg-transparent">
          <header className="sticky top-0 z-30 border-b border-border/60 bg-background/92 backdrop-blur">
            <div className="flex items-center gap-4 px-6 py-4 lg:px-10 2xl:px-12">
              <SidebarTrigger className="shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Dashboard</p>
                <h1 className="truncate text-xl font-semibold tracking-tight">
                  Portfolio control center
                </h1>
              </div>
              <div className="hidden items-center gap-3 md:flex">
                <div className="flex items-center gap-2 rounded-full border bg-card p-1">
                  <Button
                    type="button"
                    variant={theme === "light" ? "default" : "ghost"}
                    size="icon-sm"
                    className="rounded-full"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant={theme === "dark" ? "default" : "ghost"}
                    size="icon-sm"
                    className="rounded-full"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="size-4" />
                  </Button>
                </div>
              </div>
            </div>

            <nav className="flex flex-wrap gap-3 px-6 pb-4 lg:px-10 2xl:px-12">
              {dashboardLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`
                  }
                >
                  <item.icon className="size-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </header>

          <main className="flex-1 px-6 py-8 lg:px-10 2xl:px-12">
            <Outlet context={{ profile }} />
          </main>
        </SidebarInset>

        <Toaster position="bottom-right" />
      </div>
    </SidebarProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Remove the hardcoded wrapper here. The layouts handle the wrappers natively now. */}
      <Routes>
        {/* PORTFOLIO ROUTES (These handle their own footer via PortfolioShell) */}
        <Route path="/" element={<DefaultPortfolioRoute />} />
        <Route path="/preview/:index" element={<DefaultPortfolioRoute />} />
        <Route path="/portfolio/:token" element={<SharedPortfolioRoute />} />
        <Route path="/portfolio/:token/:index" element={<SharedPortfolioRoute />} />

        {/* BASE LAYOUT ROUTES (These use the GlobalFooter) */}
        <Route element={<BaseLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Route>

        {/* DASHBOARD ROUTES (These have no footer, just the sidebar) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="portfolios" element={<PortfolioManager />} />
          <Route path="portfolios/:index/edit" element={<EditPortfolioRoute />} />
          <Route path="submissions" element={<SubmissionInbox />} />
          <Route path="icons" element={<LucideIconBrowser />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}